var express = require('express');
var router = express.Router();

router.get('/majors', function(req, res, next) {
  var db = req.db;
  var collection = db.get('majors');
  collection.find({},{},function(e,docs){
      res.json(docs);
  });
});

router.get('/sections', function(req, res, next) {
  var db = req.db;
  var collection = db.get('sections');
  collection.find({},{},function(e,docs){
      res.json(docs);
  });
});

router.get('/sections/:major', function(req, res, next) {
  var db = req.db;
  var collection = db.get('sections');

  collection.find({"major": req.params.major.toUpperCase()},{},function(e,docs){
      res.json(docs);
  });
});

router.get('/courses/:major', function(req, res, next) {
  var db = req.db;
  var collection = db.get('sections');

  collection.aggregate([
    {$match: {"major": req.params.major}},
    {$group:{
      _id:"$course_number",
      ident:{$first:"$course_number"},
      major:{$first:"$major"},
      majorName:{$first:"$majorName"},
      name:{$first:"$name"},
      instructors: {$addToSet:{$concat:["$instructor.lname",", ","$instructor.fname"]}},
      sections:{$push:{
        call_number: "$$CURRENT.call_number",
        credits: "$$CURRENT.credits",
        ident: "$$CURRENT.section",
        instructor: "$$CURRENT.instructor",
        timeslots: "$$CURRENT.timeslots"
      }}}
    },
    {$sort:{_id: 1}}
  ],{},function(e,docs){
      if (e)
        res.send(e);
      else
        res.json(docs);
  });
});

module.exports = router;