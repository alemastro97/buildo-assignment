const express = require('express');
const passport = require('passport');
const router = express.Router();
const { login, register } = require('../controllers/User.Controller');

router.post('/register', () => {console.log('skskskskskks')});//register);
router.post('/login', passport.authenticate('local'), login);

module.exports = router;