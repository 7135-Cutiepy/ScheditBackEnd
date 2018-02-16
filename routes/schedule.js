var express = require('express');
var router = express.Router();

var rhc = require('./../../scheditAlgorithm/rhc');

router.get('/', function(req, res, next) {
  res.send(rhc(require('./schedprefs.json')));
});

module.exports = router;