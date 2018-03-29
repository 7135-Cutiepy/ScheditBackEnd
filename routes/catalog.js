var express = require('express');
var router = express.Router();

router.get('/sections', function(req, res, next) {
  var db = req.db;
  var collection = db.get('sections');
  collection.find({},{},function(e,docs){
      res.json(docs);
  });
});

module.exports = router;
