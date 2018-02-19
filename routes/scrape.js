var express = require('express');
var router = express.Router();

var request = require('request');
var cheerio = require('cheerio');

router.get('/', function(req, res, next) {
  url = 'http://www.imdb.com/title/tt1229340/';

  request(url, function(error, response, html){
    console.log(html);
    if(!error){
      var $ = cheerio.load(html);

      // Finally, we'll define the variables we're going to capture

      var title, release, rating;
      var json = { title : "", release : "", rating : ""};

      $('.header').filter(function(){
        var data = $(this);
          title = data.children().first().text();
          release = data.children().last().children().text();
          json.title = title;
          json.release = release;
      });

      $('.star-box-giga-star').filter(function(){
        var data = $(this);
        rating = data.text();
        json.rating = rating;
      });
      console.log(json);
    }
  });

});

module.exports = router;