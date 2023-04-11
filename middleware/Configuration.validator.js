const Joi = require('joi');

const {ConfigurationElementJoi} = require('../models/Configuration.model')
// Middleware to validate user input

const validateConfiguration = (req, res, next) => {
  const { error, _ } = ConfigurationElementJoi.validate(req.body);

  if (error) {
    // Return 400 Bad Request if validation fails
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};

module.exports ={ validateConfiguration };
