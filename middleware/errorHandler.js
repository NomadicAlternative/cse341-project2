// Custom error type thrown by controllers and the 404 middleware
const HttpError = require('../utils/HttpError');

// Catch-all for unknown routes. It runs only when no route matched,
// and forwards a 404 into the central error handler so the response
// is JSON like every other error.
const notFound = (req, res, next) => {
  next(new HttpError(404, 'Route not found'));
};

// Central error handler. Express identifies error middleware by its
// signature, so this MUST keep exactly four parameters, even though
// "next" is unused.
const errorHandler = (err, req, res, next) => {
  // Always log the full error on the server for debugging; the client
  // never sees the stack trace.
  console.error(err);

  // Errors we threw ourselves (404 not found, 400 bad reference, ...)
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details ?? undefined,
    });
  }

  // Mongoose schema validation failure (missing or invalid fields)
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Mongoose could not cast a value, e.g. a malformed ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid id format' });
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({ error: 'Duplicate key' });
  }

  // body-parser rejected the payload before any route or validator ran
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Malformed JSON in request body' });
  }

  // Payload exceeded the body size limit
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request body too large' });
  }

  // Anything unexpected: generic 500, never leak internals
  return res.status(500).json({ error: 'Internal server error' });
};

module.exports = { notFound, errorHandler };
