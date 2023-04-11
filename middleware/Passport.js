const passport = require('passport');
const passportJWT = require('passport-jwt');
const User = require('../models/User.model');
const { secret, options } = require("../config/auth.json");

const session = require('express-session');

const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

/*  parameters needed to configure the `Strategy` for passport-jwt authentication. */
const params = {
  secretOrKey: secret,
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
        secret,
        resave: false,
        saveUninitialized: false,
      });
    },
    authenticate: function () {
      return passport.authenticate('jwt', options);
    },
  };
};
