const express = require('express');
const router = express.Router();

const ConfigurationController = require('../controllers/Configuration.Controller');
const { validateConfiguration: ConfigurationValidator } = require('../middleware/Configuration.validator');
const { authenticate } = require('../middleware/Passport')();

/* These line of code are creating new routes for handling HTTP requests to the root URL ('http://localhost:3000/configuration/...') of
the server. It is using the `authenticate()` middleware function to ensure that the user is
authenticated before allowing access to the route. It is also using the `ConfigurationValidator`
middleware function to validate the request body before passing it to the service */

//Create a new configuration
router.post('/', authenticate(), ConfigurationValidator, ConfigurationController.createConfiguration);

//Get all configurations
router.get('/', authenticate(), ConfigurationController.getConfigurations);

//Get a configuration by id
router.get('/:id', authenticate(), ConfigurationController.findConfigurationById);

//Update a configuration by id
router.patch('/:id', authenticate(), ConfigurationController.updateConfiguration);

//Delete a configuration by id
router.delete('/:id', authenticate(), ConfigurationController.deleteConfiguration);

module.exports = router;
