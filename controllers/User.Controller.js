const  User = require("../models/User.model");
// const  config = require("../config.js");
const  jwt = require("jwt-simple");

const login = (req, res) => {
  console.log("Logged In");
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      console.log("Error Happened In auth /token Route");
    } else {
      var payload = {
        id: user.id,
        expire: Date.now() + 1000 * 60 * 60 * 24 * 7, //7 days
      };
      var token = jwt.encode(payload, 's0m3$3Cret$h0lyC0d3&$');
      res.json({
        token: token,
      });
    }
  });
};
const register = (req, res) => {
  User.register(
    new User({ name: req.body.name, username: req.body.username }),
    req.body.password,
    function (err, msg) {
      if (err) {
        res.send(err);
      } else {
        res.send({ message: "Successful" });
      }
    }
  );
};

module.exports = { register, login }