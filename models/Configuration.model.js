const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi')
const ConfigurationElementJoi = Joi.object({
  name: Joi.string().required(),
  host: Joi.string().required(),
  port: Joi.number().integer().required(),
  database_url: Joi.string().required(),
  logging_level: Joi.string().required()
}).unknown(true).options({stripUnknown: true});

const ConfigurationElementSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  host: {
    type: String,
    required: true
  },
  port: {
    type: Number,
    required: true
  },
  database_url: {
    type: String,
    required: true
  },
  logging_level: {
    type: String,
    required: true
  }
}, { strict: false });

/* `ConfigurationSchema` is defining a Mongoose schema for a configuration object. It has one
field called `configurations` which is an array of objects that follow the `ConfigurationElementSchema`
schema. The `default` option sets the default value of `configurations` to an empty array. */
const ConfigurationSchema = new Schema({
  configurations: { type: [ConfigurationElementSchema], default: [] },
});

const Configuration = mongoose.model('configuration', ConfigurationSchema);
const ConfigurationElement = mongoose.model('configurationElement', ConfigurationElementSchema);
module.exports = {Configuration, ConfigurationElement, ConfigurationElementJoi};