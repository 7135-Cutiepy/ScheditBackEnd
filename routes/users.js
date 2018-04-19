var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

/* GET home page. */
router.post('/register', function(req, res, next) {
  var db = req.db;
  var collection = db.get('users');

  console.log(req.body);

  var email = req.body.email;
  var password = req.body.password;

  bcrypt.genSalt(10, (err, salt)=>{
    bcrypt.hash(req.body.password, salt, (err, hash)=>{
      hashed = hash;

      var newUser = {
        email: email,
        password: hashed
      };

      collection.insert(newUser);
    })
  })
  res.send('User: ' + email + ' registered');
});

router.post('/authenticate', function(req, res, next) {
  var db = req.db;
  var collection = db.get('users');
  
  var email = req.body.email;
  var password = req.body.password;

  collection.findOne({email: email})
    .then((user)=>{

      bcrypt.compare(password, user.password, (err, isMatch)=>{
        if (err) throw err;
        if (isMatch) {
          var token = jwt.sign(user, 'secret', {
            expiresIn: 604800 //1 week
          });
  
          res.json({
            success: true,
            token: 'JWT '+token,
            user: {
              id: user._id,
              email: user.email
            }
          });
        } else {
          res.json({
            success: false,
            msg: 'Wrong password'
          });
        }
      });
    })
});

router.get('/profile', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  res.json({user: req.user});
});

module.exports = router;
