const express = require('express');
const createError = require('http-errors');
// const dotenv = require('dotenv').config();

/** Express server initializarion */
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize MongoDB and connection
require('./db')();

/** Router Management */

// Auth routes
const AuthenticationRoutes = require('./routes/Auth.route');
const auth = require('./middleware/Passport')();
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/User.model');
app.use(auth.initialize());
// Passport Config
passport.use(new localStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
// app.use(AuthenticationRoutes);

// Configuration routes
const ConfigurationRoutes = require('./routes/Configuration.route');
app.use('/configuration', ConfigurationRoutes);

// 404 handler and pass to error handler
app.use((req, res, next) => {
  next(createError(404, 'Not found'));
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

/** Get port on which the server runs */
const PORT = process.env.PORT || 3000;

/** Start server */
app.listen(PORT, () => {
  console.log('Server started on port ' + PORT + '...');
});
