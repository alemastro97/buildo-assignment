const express = require('express');
const passport = require('passport');
const router = express.Router();
const { login, register } = require('../controllers/User.Controller');


// Route to register a new user
router.post('/register', register);
// Route to log a user
router.post('/login', passport.authenticate('local'), login);

module.exports = router;