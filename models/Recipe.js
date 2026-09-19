// Load Mongoose to define the schema and the model
const mongoose = require('mongoose');

// Reusable validator: an array field must exist and contain at least one item.
// We use a custom validator instead of required alone so the Mongoose error
// message is meaningful in the 400 response.
const nonEmptyArray = {
  validator: (value) => Array.isArray(value) && value.length >= 1,
  message: 'Must contain at least one item',
};

const recipeSchema = new mongoose.Schema(
  {
    // 1
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
    },
    // 2
    description: {
      type: String,
      required: true,
      trim: true,
    },
    // 3
    ingredients: {
      type: [String],
      required: true,
      validate: nonEmptyArray,
    },
    // 4
    steps: {
      type: [String],
      required: true,
      validate: nonEmptyArray,
    },
    // 5
    prepTimeMinutes: {
      type: Number,
      required: true,
      min: [0, 'Prep time cannot be negative'],
    },
    // 6
    cookTimeMinutes: {
      type: Number,
      required: true,
      min: [0, 'Cook time cannot be negative'],
    },
    // 7
    servings: {
      type: Number,
      required: true,
      min: [1, 'Servings must be at least 1'],
    },
    // 8
    difficulty: {
      type: String,
      required: true,
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: 'Difficulty must be easy, medium or hard',
      },
    },
    // 9
    cuisine: {
      type: String,
      required: true,
      trim: true,
    },
    // 10 — reference to the Category collection
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    // 11
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// "Recipe" becomes the "recipes" collection in MongoDB
module.exports = mongoose.model('Recipe', recipeSchema);
