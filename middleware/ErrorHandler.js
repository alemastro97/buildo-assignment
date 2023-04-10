const createError = require('http-errors');

module.exports = {
    /* This is an error handling middleware function in Express. It takes four parameters: `err`, `req`,
    `res`, and `next`. If any error occurs in the application, this middleware function will be called
    to handle the error. It sets the HTTP status code of the response to the error status code or 500
    (Internal Server Error) if no status code is provided. It then sends a JSON response with an error
    object containing the status code and message of the error. */
  error: (err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
      error: {
        status: err.status || 500,
        message: err.message,
      },
    });
  },
  /* `notFound` is a middleware function in Express that is called when a route is not found. It
  creates a 404 error using the `createError` function from the `http-errors` package and passes it
  to the `next` function to be handled by the error handling middleware. This will result in a JSON
  response with an error object containing the status code and message "Not found". */
  notFound: (req, res, next) => {
    next(createError(404, 'Not found'));
  },
};
