var url = require('url');
var express = require('express');
var cheerio = require('cheerio');
var superagent = require('superagent');
var eventproxy = require('eventproxy');

var targetUrl = 'https://cnodejs.org/';
superagent.get(targetUrl)
    .end(function (err, res) {
        if(err){
        	return console.error(err);
        }
        var topicUrls = [];
        var $ = cheerio.load(res.text);
        //获取首页所有链接
        $('#topic_list .topic_title').each(function(idx, element){
        	var $element = $(element);
        	var href = url.resolve(targetUrl, $element.attr('href'));
        	console.log(href);
        	
        });
        
    });
