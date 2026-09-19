// Load Mongoose to define the schema and the model
const mongoose = require('mongoose');

// A Category groups related recipes (e.g. "Desserts", "Main Dishes").
// The unique constraint on name is intentional: it matches the documented
// data model, and duplicates are reported as 409 by the central error handler.
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
});

// "Category" becomes the "categories" collection in MongoDB
module.exports = mongoose.model('Category', categorySchema);
