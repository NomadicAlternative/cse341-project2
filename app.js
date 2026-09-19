// Load environment variables from .env into process.env.
// This MUST be the first executable line so every module below sees them.
require('dotenv').config();

// Third-party libraries
const express = require('express');
const swaggerUi = require('swagger-ui-express');
// Generated Swagger document (produced by `npm run swagger`)
const swaggerDocument = require('./swagger.json');

// Own modules
const connectDB = require('./db/connect');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Create the Express application
const app = express();

// Parse JSON request bodies into req.body
app.use(express.json());

// Port from the environment (Render) or the local default
const port = process.env.PORT || 8080;

// Simple health/landing route
app.get('/', (req, res) => {
  res.send('Recipe Book API');
});

// Interactive API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mount the central router (handles /recipes and /categories)
app.use('/', require('./routes'));

// Unknown route -> JSON 404
app.use(notFound);
// Central error handler -> always the last middleware
app.use(errorHandler);

// Connect to MongoDB first, then start listening for HTTP requests
async function start() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Only boot the server when this file is run directly.
// When the module is required (e.g. in a smoke test) we export the app
// without opening a port or touching the database.
if (require.main === module) {
  start();
}

module.exports = app;
