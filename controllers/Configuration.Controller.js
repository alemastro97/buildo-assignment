const createError = require('http-errors');
const mongoose = require('mongoose');

const { Configuration, ConfigurationElement } = require('../models/Configuration.model');

module.exports = {
  /**
   * Add a new configuration for the user
   * @param {Object} req: request that contains the information related to the user and as body the new configuration
   * @param {Object} res: response's call
   * @param {Function} next
   *
   * @returns is the updated object related to the user
   */
  createConfiguration: async (req, res, next) => {
    const {
      user: { id },
      body,
    } = req;
    try {
      /* Get the configuration row created for the user */
      const configuration = await Configuration.findById(id);

      /* Checking if a configuration exists for the user. If it does not exist,  it throws a 404 error with the message "Configuration does not exist." */
      if (!configuration) {
        throw createError(404, 'Configuration does not exist.');
      }

      /* Check if a configuration with the name choose by the user already exists*/
      const service = configuration.configurations.find(({ name }) => name === body.name);
      /* if configuration exists it throws a 404 error with the message "Configuration already exist." */
      if (service) {
        throw createError(404, 'Configuration already exists.');
      }

      /* adding a new configuration element to the `configurations` array of the `configuration` object. The new
      configuration element is created using the `ConfigurationElement` model and the `body` object
      passed in the request. The spread operator `...` is used to copy all the properties of the
      `body` object into the new configuration element. */
      configuration.configurations.push(new ConfigurationElement({ ...body }));
      /* Saving the updated `configuration` object to
      the database and returning the updated object as `result`*/
      const result = await configuration.save();

      res.send({ result });
    } catch (error) {
      console.log(error.message);
      if (error.name === 'ValidationError') {
        next(createError(422, error.message));
        return;
      }
      next(error);
    }
  },

  /**
   * Get all the configurations related to the user
   * @param {Object} req: request that contains the information related to the user
   * @param {Object} res: response's call
   * @param {Function} next
   *
   * @returns is the array of configurations
   */
  getConfigurations: async ({ user: { id } }, res, next) => {
    try {
      /** Find the configuration related to the user */
      const { configurations } = await Configuration.findById(id);

      /* Checking if a configuration exists for the user. If it does not exist,
      it throws a 404 error with the message "Configuration does not exist." */
      if (!configurations) {
        throw createError(404, 'Configuration does not exist.');
      }

      res.send(configurations);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, 'Invalid User id'));
        return;
      }
      next(error);
    }
  },

  /**
   * Find a configuration from name
   * @param {Object} req: request that contains the information related to the user and as params the configuration name to search
   * @param {Object} res: response's call
   * @param {Function} next
   *
   * @returns is the updated object related to the user
   */
  findConfigurationById: async (req, res, next) => {
    const {
      user: { id },
      params: { id: serviceName },
    } = req;
    try {
      /** Find the configuration related to the user */
      const configuration = await Configuration.findById(id);

      /* Checking if a configuration exists for the user. If it does not exist,
      it throws a 404 error with the message "Configuration does not exist." */
      if (!configuration) {
        throw createError(404, 'Configuration does not exist.');
      }

      /* Check if a configuration with the name choose by the user exists*/
      const service = configuration.configurations.find(({ name }) => name === serviceName);

      // const result = await configuration.save();

      res.send(service);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, 'Invalid User id'));
        return;
      }
      next(error);
    }
  },

  /**
   * Update a configuration from name
   * @param {Object} req: request that contains the information related to the user and as body the new configuration params
   * @param {Object} res: response's call
   * @param {Function} next
   *
   * @returns is the updated object related to the user
   */
  updateConfiguration: async (req, res, next) => {
    const {
      user: { id },
      body,
      params: { id: serviceName },
    } = req;
    try {
      /* Get the configuration row created for the user */
      const configuration = await Configuration.findById(id);

      /* Checking if a configuration exists for the user. If it does not exist,  it throws a 404 error with the message "Configuration does not exist." */
      if (!configuration) {
        throw createError(404, 'Configuration does not exist.');
      }

      /** If user set the name and it is different from the configuration we check if already exists a configuration with this name*/
      if ('name' in body && body.name !== serviceName) {
        const service = configuration.configurations.find(({ name }) => name === body.name);
        if (service) {
          throw createError(404, 'A configuration with the selected name already exists, please choose another name');
        }
      }

      /** Save the  old configuration */
      const oldConfig = configuration.configurations.find((conf) => conf.name === serviceName);
      
      /** Delete the configuration */
      configuration.configurations = configuration.configurations.filter((conf) => conf.name !== serviceName);
      const new_configuration = await configuration.save();

      /** Add the configuration modified */
      new_configuration.configurations.push(Object.assign({},{...oldConfig._doc},body))

      /** Update the user config on MongoDB */
      const result = await new_configuration.save();

      res.send({ result });
    } catch (error) {
      console.log(error.message);
      if (error.name === 'ValidationError') {
        next(createError(422, error.message));
        return;
      }
      next(error);
    }
  },

  /**
   * Delete a configuration from name
   * @param {Object} req: request that contains the information related to the user and as params the configuration name to delete
   * @param {Object} res: response's call
   * @param {Function} next
   *
   * @returns is the updated object related to the user
   */

  deleteConfiguration: async (req, res, next) => {
    const {
      user: { id },
      params: { id: serviceName },
    } = req;
    try {
      /** Find the configuration related to the user */
      const configuration = await Configuration.findById(id);

      /* Checking if a configuration exists for the user. If it does not exist,
      it throws a 404 error with the message "Configuration does not exist." */
      if (!configuration) {
        throw createError(404, 'Configuration does not exist.');
      }

      /* Create a new array in which is not present the configuration*/
      configuration.configurations = configuration.configurations.filter(({ name }) => name !== serviceName);
      const result = await configuration.save();
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, 'Invalid User id'));
        return;
      }
      next(error);
    }
  },
};
