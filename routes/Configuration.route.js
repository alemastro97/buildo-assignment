const express = require('express');
const router = express.Router();

const ConfigurationController = require('../controllers/Configuration.Controller');
const { validateConfiguration : ConfigurationValidator } = require('../middleware/Configuration.validator');
//Create a new product
router.post('/', ConfigurationValidator, ConfigurationController.createConfiguration);

//Get all configurations
router.get('/', ConfigurationValidator, ConfigurationController.getConfigurations);


//Get a configuration by id
router.get('/:id', ConfigurationValidator, ConfigurationController.findConfigurationById);

//Update a configuration by id
router.patch('/:id', ConfigurationValidator, ConfigurationController.updateConfiguration);

//Delete a configuration by id
router.delete('/:id', ConfigurationValidator, ConfigurationController.deleteConfiguration);

module.exports = router;