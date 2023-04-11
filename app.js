const express = require('express');

/** Express server initializarion */
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize MongoDB and connection
require('./db')();
// Initialize Passport for the Authentication
require('./auth')(app);


/** Router Management */
// Auth routes
const AuthenticationRoutes = require('./routes/Auth.route');
app.use(AuthenticationRoutes);

// Configuration routes
const ConfigurationRoutes = require('./routes/Configuration.route');
app.use('/configuration', ConfigurationRoutes);

// Error handler
const {error, notFound} = require('./middleware/ErrorHandler');

app.use(notFound);

app.use(error);

/** Get port on which the server runs */
const PORT = process.env.PORT || 3001;

/** Start server */
app.listen(PORT, () => {
  console.log('Server started on port ' + PORT + '...');
});

module.exports = app
