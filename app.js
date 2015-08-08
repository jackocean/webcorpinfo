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
		
		//console.log(headers.Cookie);//每次sessionid都不同

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
				cb(imgdata);
				fs.writeFile('cccc.jpg', imgdata, 'binary', function(err) {
					if (err) {
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

// getValcode(function(){});

http.createServer(function(request, response) {

	// response.write("Hello World");
	// getValcode((function(response) {
	// var res = response;
	// return function(img){
	// //res.write("yyyyyy");
	// res.write(img);
	// res.end();
	// };
	// })(response));

	/*
	getValcode(function(img) {
		// response.writeHead(200, {
		// "Accept-Ranges": "bytes",
		// "Content-Type" : "image/jpeg",
		// "Content-Length": img.length
		// });
		response.writeHead(200, {
			"Content-Type" : "image/jpeg"
		});
		response.write(img,'binary');
		response.end();
	});
	*/
	
	
	var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    
    var sessionid = '';
    if(pathname=='/valcode'){
    	getValcode(function(img) {
    		// response.writeHead(200, {
    		// "Accept-Ranges": "bytes",
    		// "Content-Type" : "image/jpeg",
    		// "Content-Length": img.length
    		// });
    		response.writeHead(200, {
    			"Content-Type" : "image/jpeg"
    		});
    		response.write(img,'binary');
    		response.end();
    	});
        return;
    }
    
    request.setEncoding("utf8");
    var html = '<html>\
    	          <head><meta http-equiv="Content-Type" content="text/html;charset=UTF-8" /></head>\
    	          <body>\
    	            <img src="/valcode">\
    	            <input type="text">\
    	            <input type="button" value="确定">\
    	          </body>\
    	        </html>';
    
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(html);
    response.end();


}).listen(8888);
