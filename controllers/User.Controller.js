const {Configuration} = require('../models/Configuration.model');
const User = require('../models/User.model');
const { secret } = require("../config/auth.json");
const jwt = require('jwt-simple');

/**
 * This function finds a user by their username, generates a token with a payload containing their ID
 * and an expiration date, and sends the token as a response.
 * @param {Object} req - is an object that contains information about the HTTP
 * request that was made, such as the request method, headers, and body.
 * @param {Object} res - response object that is sent back to the client after the server has
 * processed the request. It contains information such as the status code, headers, and data that is
 * sent back to the client. In this case, the response object is used to send a JSON object containing
 * a token
 */
const login = (req, res) => {
/* Finding a user in the database by their username, generating a JSON Web Token (JWT)
with a payload containing the user's ID and an expiration date, and sending the token as a response.
 If there is an error finding the user, an error message is logged to the
console. */
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      console.log('Error Happened In auth /token Route');
    } else {
      var payload = {
        id: user.id,
        expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
      };
      /* The secret key is used to sign the token and ensure that it has not been tampered with during
      transmission. */
      var token = jwt.encode(payload, secret);
      res.json({
        token: token,
      });
    }
  });
};
/**
 * The function registers a new user and creates a new configuration for the user.
 * @param {Object} req - object that contains information about the HTTP
 * request that was made, such as the request parameters, headers, and body. In this specific code
 * snippet, it is being used to extract the name, username, and password from the request body.
 * @param {Object} res -  HTTP response that will be sent back
 * to the client. It contains methods and properties that allow you to set the response status,
 * headers, and body
 */
const register = (req, res) => {
  User.register(new User({ name: req.body.name, username: req.body.username }), req.body.password, function (err, msg) {
    if (err) {
      res.send(err);
    } else {
      /* Creating a new instance of the `Configuration` model with an `_id` property set to the `id` of
      the newly registered user and an empty `configurations` array. This new configuration object
      is then saved to the database for the user. */
      const userConfiguration = new Configuration({ _id: msg.id, configurations: [] });
      userConfiguration.save((err, c) => {
        if (err) {
          console.log(err);
        }
        res.json(c);
      });
    }
  });
};

module.exports = { register, login };
