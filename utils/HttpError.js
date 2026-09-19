// Custom error type for expected HTTP failures (400, 404, 409, ...).
// Controllers throw this class directly; the central error handler
// recognizes it and turns it into the correct JSON response.
class HttpError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

module.exports = HttpError;
