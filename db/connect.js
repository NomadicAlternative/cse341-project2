// Load Mongoose, the library that talks to MongoDB through models
const mongoose = require('mongoose');

// Log any connection-level error that happens after the initial connect.
// This listener is registered at module load time, so it also covers
// errors that occur while the driver is reconnecting.
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Establish the MongoDB connection using the URI from the environment.
// The URI is never hardcoded here: it comes from .env (or Render config).
async function connectDB() {
  return mongoose.connect(process.env.MONGODB_URI);
}

// Export the function so app.js can call it before starting the server
module.exports = connectDB;
