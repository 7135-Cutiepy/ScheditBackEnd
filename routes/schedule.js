var express = require('express');
var router = express.Router();
var algo = require('./algorithm/caller');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(algo);
});

module.exports = router;
