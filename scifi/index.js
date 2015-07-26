#!/usr/bin/env node

var request=require('request')
var cheerio = require('cheerio')
var mkdirp = require('mkdirp')
var URL = require('url')
var fs = require('fs')
var path = require('path')

var url = "http://wall.alphacoders.com/"
var category = 27
var folder = path.join(__dirname,"backgrounds","scifi")

function downloadPage(url,category,number,cb) {
  console.log("Downloading Page "+number)
  request(url+"by_category.php?id="+category+"&page="+number, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(response.body)
      $('div.boxgrid').children('a').each(function() {
        request(url+$(this).attr('href'),function(error,response,body) {
          if (!error && response.statusCode == 200) {
            var $2 = cheerio.load(response.body)
            if(error) console.log(error)
            else downloadImage($2('div a img[onclick="resize();"]').attr('src'))
          }
        })
      })
    } else return cb(error)
    return cb()
  })
}

function downloadImage(image) {
  var filename = image.split('/').pop()
  var file = path.join(folder,filename)
  console.log("Downloading "+file)
  request(image).on('error',function(){}).pipe(fs.createWriteStream(file))
}


mkdirp(folder,function(e) {
  loop()
})

var pageNumber = 1
function loop(e) {
  if(e) console.log(e)
  downloadPage(url,category,pageNumber++,loop)
}
