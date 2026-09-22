// Express router for the /recipes resource.
// The handlers these routes invoke live in controllers/recipes.js, and every
// one of them wraps its work in a try/catch block that forwards failures to the
// central error handler (middleware/errorHandler.js) with next(err).
const express = require('express');
const { body, param } = require('express-validator');

// Controller handlers and the shared validation middleware
const {
  listRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipes');
const validate = require('../middleware/validate');

// Every route with :id must receive a well-formed ObjectId
const idRule = param('id').isMongoId().withMessage('Invalid recipe id');

// Fields a client is allowed to send on create/update.
const editableFields = [
  'title',
  'description',
  'ingredients',
  'steps',
  'prepTimeMinutes',
  'cookTimeMinutes',
  'servings',
  'difficulty',
  'cuisine',
  'category',
  'isPublished',
];

// Build the body rules. On PUT every field is optional and the request
// must carry at least one editable field; on POST the fields are required
// (isPublished is always optional because the model defaults it to false).
const buildRecipeRules = (applyOptional) => {
  const opt = (chain) => (applyOptional ? chain.optional() : chain);

  return [
    opt(
      body('title')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Title must be at least 3 characters long')
    ),
    opt(body('description').trim().notEmpty().withMessage('Description is required')),
    opt(body('ingredients').isArray({ min: 1 }).withMessage('Ingredients must be a non-empty array')),
    opt(body('steps').isArray({ min: 1 }).withMessage('Steps must be a non-empty array')),
    opt(body('prepTimeMinutes').isInt({ min: 0 }).withMessage('Prep time must be an integer >= 0').toInt()),
    opt(body('cookTimeMinutes').isInt({ min: 0 }).withMessage('Cook time must be an integer >= 0').toInt()),
    opt(body('servings').isInt({ min: 1 }).withMessage('Servings must be an integer >= 1').toInt()),
    opt(
      body('difficulty')
        .isIn(['easy', 'medium', 'hard'])
        .withMessage('Difficulty must be easy, medium or hard')
    ),
    opt(body('cuisine').trim().notEmpty().withMessage('Cuisine is required')),
    opt(body('category').isMongoId().withMessage('Category must be a valid category id')),
    body('isPublished')
      .optional()
      .isBoolean()
      .withMessage('isPublished must be a boolean')
      .toBoolean(),
  ];
};

// PUT with an empty object would be a no-op, so reject it with a clear message
const nonEmptyUpdate = body().custom((value, { req }) => {
  const body = req.body ?? {};
  if (!editableFields.some((key) => key in body)) {
    throw new Error('Provide at least one field to update');
  }
  return true;
});

const router = express.Router();

router.get('/', listRecipes);

router.get('/:id', [idRule, validate], getRecipe);

router.post('/', [...buildRecipeRules(false), validate], createRecipe);

router.put(
  '/:id',
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'Recipe fields to update (at least one is required)',
      required: true,
      schema: {
          title: 'Chicken Curry',
          description: 'A warming weeknight curry',
          ingredients: ['chicken', 'curry paste', 'coconut milk'],
          steps: ['Brown the chicken', 'Simmer 20 minutes'],
          prepTimeMinutes: 15,
          cookTimeMinutes: 25,
          servings: 4,
          difficulty: 'easy',
          cuisine: 'Indian',
          category: '507f1f77bcf86cd799439011',
          isPublished: true
      }
  } */
  [idRule, ...buildRecipeRules(true), nonEmptyUpdate, validate],
  updateRecipe
);

router.delete('/:id', [idRule, validate], deleteRecipe);

module.exports = router;
