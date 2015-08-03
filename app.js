var fs = require('fs');
var url = require('url');
var http = require('http');
var cookie = require('cookie');
//var request = require('request');
var express = require('express');
var cheerio = require('cheerio');
var superagent = require('superagent');
var eventproxy = require('eventproxy');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var cookieparser = require('cookie-parser');

var targetUrl = 'http://gsxt.zjaic.gov.cn/search/doGetAppSearchResultIn.do';

var headers = {
    Accept: 'image/webp,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, sdch',
    'Accept-Language': 'zh-CN,zh;q=0.8',
    Cookie:'',
    Host: 'gsxt.zjaic.gov.cn',
    'Proxy-Connection': 'keep-alive',
    Referer: 'http://gsxt.zjaic.gov.cn/search/doGetAppSearchResultIn.do',
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36'
};


//var imgsrc = 'http://imglf.nosdn.127.net/img/TGJDYUZPNmdKdTlQdmd5NjArZ1VVZVlKejhsUksrSGo.jpg?imageView&thumbnail=500x0&quality=96&stripmeta=0&type=jpg';
//http.get(imgsrc,function(res){
//   //res.pipe(writestream);
//console.log(111);
//});
//
//var options = {
//	        	host: 'gsxt.zjaic.gov.cn',
//	            hostname: 'gsxt.zjaic.gov.cn',
//	            port: 80,
//	            method: 'get',
//	            path: '/common/captcha/doReadKaptcha.do',
//	            headers:{}
//	        };
//	        //options.headers = headers;
//	        options.host = 'imglf.nosdn.127.net';
//	        options.hostname = 'imglf.nosdn.127.net';
//	        options.path = '/img/TGJDYUZPNmdKdTlQdmd5NjArZ1VVZVlKejhsUksrSGo.jpg?imageView&thumbnail=500x0&quality=96&stripmeta=0&type=jpg';
//	        
//var req = http.request(options,function(res){
//    console.log('222');
//});	        	
//req.end(); 

superagent.get(targetUrl).end(function (err, res) {
        if(err){
        	return console.error(err);
        }
        
        //console.log(res.text);
        //console.log(res.headers);
        //console.log(res.headers);
        //console.log(res.headers['set-cookie']);
        //console.log(res.headers.cookie);
        //cookie.parse(req.headers.cookie)
        var sid = cookie.parse(res.headers['set-cookie'][0])['JSESSIONID'];
        //console.log(sid);
        headers.Cookie = 'JSESSIONID=' + sid;
        //console.log(headers.cookie);
        //headers.cookie = 'CNZZDATA1000503299=1155596647-1437749885-http%253A%252F%252Fgsxt.zjaic.gov.cn%252F%7C1438531438; JSESSIONID=' + sid;
        //headers.cookie ='JSESSIONID=26A95651B79D15132485FE9DA2E534D8-n1.gsxt46; CNZZDATA1000503299=1155596647-1437749885-http%253A%252F%252Fgsxt.zjaic.gov.cn%252F%7C1438609956';
        var $ = cheerio.load(res.text);
        $('#kaptchaImg').each(function(idx, element){
        	//console.log(element);
        	//var imgsrc = url.resolve(targetUrl, element.attribs.src);
        	var imgsrc = url.resolve(targetUrl, $(element).attr('src'));
        	//imgsrc = 'http://imglf.nosdn.127.net/img/TGJDYUZPNmdKdTlQdmd5NjArZ1VVZVlKejhsUksrSGo.jpg?imageView&thumbnail=500x0&quality=96&stripmeta=0&type=jpg';
        	//console.log(imgsrc);
        	var writestream = fs.createWriteStream('aaaaa.jpg');
        	
        	//.set(headers)
//        	superagent.get(imgsrc).end(function (err, res) {
//        		if(err){
//                	return console.error(err);
//                }
//        		//console.log(res);
//        		res.pipe(writestream);
//        	});

            /* 普通图片可行
        	http.get(imgsrc,function(res){
        		res.pipe(writestream);
        	});
        	*/
	
        	var options = {
	        	host: 'gsxt.zjaic.gov.cn',
	            hostname: 'gsxt.zjaic.gov.cn',
	            port: 80,
	            method: 'get',
	            path: '/common/captcha/doReadKaptcha.do',
	            headers:headers
	        };
        	
	        console.log(headers.Cookie);
	        console.log(options.headers);
	        //options.headers = headers;
	       ////options.host = 'imglf.nosdn.127.net';
	       ////options.hostname = 'imglf.nosdn.127.net';
	        ////options.path = '/img/TGJDYUZPNmdKdTlQdmd5NjArZ1VVZVlKejhsUksrSGo.jpg?imageView&thumbnail=500x0&quality=96&stripmeta=0&type=jpg';
	        
	        var req = http.request(options,function(res){
	        	console.log('111');
	        	
	        	//res.setEncoding('binary');//设置了就不对
	        	
	        	//res.pipe(writestream);
	        	var bufferHelper = new BufferHelper();
	            res.on('data',function(chunk){
	            	//bufferHelper.concat(chunk);
	            	writestream.write(chunk);
	            	//console.log('BODY' + chunk);
	            	//console.log('444');
	            });
	            
	            res.on('end', function() {
	            	//var result = iconv.decode(bufferHelper.toBuffer(),'utf8');
	            	//bufferHelper.toBuffer()
	            	//console.log('BODY' + result);
	            	writestream.end();
                });
        	});
	        
        	req.on('error',function(e){
        		console.log(e.message);
        	});
        	
        	req.end();
	
        	
        	writestream.on('finish', function(){
        		console.log('downloaded');
        	});
        	
//        	superagent.get(imgsrc).end(function (err, res) {
//        		if(err){
//                	return console.error(err);
//                }
//        		debugger
//        		//console.log(res);
//        	});
        	    
    });
        
        
        
        
        //获取首页所有链接
//        $('#topic_list .topic_title').each(function(idx, element){
//        	var $element = $(element);
//        	var href = url.resolve(targetUrl, $element.attr('href'));
//        	//console.log(href);
//        	topicUrls.push(href);
//        });
        
        
        
        
});
