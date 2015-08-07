var fs = require('fs');
var url = require('url');
var http = require('http');
var cookie = require('cookie');
var express = require('express');
var cheerio = require('cheerio');
var superagent = require('superagent');
var eventproxy = require('eventproxy');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var cookieparser = require('cookie-parser');

var targetUrl = 'http://gsxt.zjaic.gov.cn/search/doGetAppSearchResultIn.do';

var headers = {
	Accept : 'image/webp,*/*;q=0.8',
	/*
	 * 'Accept-Encoding': 'gzip, deflate, sdch',
	 * 傻逼的网站对图片进行了gzip，浏览器可以ungzip，但这个nodejs发的请求不能ungzip
	 */
	'Accept-Language' : 'zh-CN,zh;q=0.8',
	Cookie : '',
	Host : 'gsxt.zjaic.gov.cn',
	'Proxy-Connection' : 'keep-alive',
	Referer : 'http://gsxt.zjaic.gov.cn/search/doGetAppSearchResultIn.do',
	'User-Agent' : 'Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36'
};

var getValcode = function(cb) {
	superagent.get(targetUrl).end(function(err, res) {
		if (err) {
			return console.error(err);
		}

		var sid = cookie.parse(res.headers['set-cookie'][0])['JSESSIONID'];
		headers.Cookie = 'JSESSIONID=' + sid;

		var options = {
			host : 'gsxt.zjaic.gov.cn',
			hostname : 'gsxt.zjaic.gov.cn',
			port : 80,
			method : 'get',
			path : '/common/captcha/doReadKaptcha.do',
			headers : headers
		};

		// var ws = fs.createWriteStream('aaaaa.jpg');
		// ws.on('finish', function() {
		// console.log('downloaded');
		// });
		//
		// http.get(options, function(res) {
		// res.pipe(ws);
		// cb(res);
		// });

		var req = http.request(options, function(res) {
			console.log('111');

			var imgdata = '';
			res.setEncoding('binary');

			res.on('data', function(chunk) {
				imgdata += chunk;
			});

			res.on('end', function() {
				//cb(imgdata);
				fs.writeFile('cccc.jpg', imgdata, 'binary', function(err){
            		if(err){
            			console.log('fail');
            		}
            		
            	});
			});
		});

		req.on('error', function(e) {
			console.log(e.message);
		});

		req.end();

	});
};

getValcode(function(){});

//var http = require("http");

//http.createServer(function(request, response) {
//
//	// response.writeHead(200, {
//	// "Content-Type" : "text/plain"
//	// });
//	response.write("Hello World");
//	getValcode(function(img) {
//		
//	    response.write("Hello World");
//		//response.write(img)
//        response.end();
//	});
//	
//}).listen(8888);

