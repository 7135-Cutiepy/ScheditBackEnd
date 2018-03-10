var express = require('express');
var router = express.Router();

var rhc = require('./../../ScheditAlgorithm/rhc');

router.get('/', function(req, res, next) {
  res.send(rhc(require('./schedprefs.json')));
});

module.exports = router;