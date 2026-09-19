// Load the validation result extractor from express-validator
const { validationResult } = require('express-validator');
// Custom error type, so the central handler can format the 400 response
const HttpError = require('../utils/HttpError');

// Runs after the validation chains of a route. If any field failed,
// it forwards an HttpError(400) carrying the list of failures; otherwise
// it lets the request continue to the controller.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError(400, 'Validation failed', errors.array()));
  }
  next();
};

// Default export is the middleware function; named export kept for convenience
module.exports = validate;
module.exports.validate = validate;
