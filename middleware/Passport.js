const passport = require('passport');
const passportJWT = require('passport-jwt');
const User = require('../models/User.model');
// const cfg = require("../config.js");
const session = require('express-session');

const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
  secretOrKey: 's0m3$3Cret$h0lyC0d3&$',
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('jwt'),
};

module.exports = () => {
  var strategy = new Strategy(params, function (payload, done) {
    var user = User.findById(payload.id, function (err, user) {
      if (err) {
        return done(new Error('UserNotFound'), null);
      } else if (payload.expire <= Date.now()) {
        return done(new Error('TokenExpired'), null);
      } else {
        return done(null, user);
      }
    });
  });
  passport.use(strategy);
  return {
    initialize: function () {
      return session({
        secret: 's0m3$3Cret$h0lyC0d3&$',
        resave: false,
        saveUninitialized: false
      });
    },
    authenticate: function () {
      return passport.authenticate('jwt', {
        session: false
    });
    },
  };
};
