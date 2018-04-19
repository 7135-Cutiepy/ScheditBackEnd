var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var monk = require('monk');
var db = monk('localhost:27017/schedit');

module.exports = function(passport) {
    var opts = {};

    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = 'secret';

    passport.use(new JwtStrategy(opts, (jwt_payload, done)=>{
        console.log(jwt_payload)
        collection = db.get('users');
        collection.findOne({_id: jwt_payload._id})
            .then((user)=>{
                return done(null, user)
            })
    }))
}