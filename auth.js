const auth = require('./middleware/Passport')();
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/User.model');

module.exports = (app) => {
  app.use(auth.initialize());

  passport.use(new localStrategy(User.authenticate()));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
};
