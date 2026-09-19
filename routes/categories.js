// Express router for the /categories resource
const express = require('express');
const { body, param } = require('express-validator');

// Controller handlers and the shared validation middleware
const {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categories');
const validate = require('../middleware/validate');

// Every route with :id must receive a well-formed ObjectId
const idRule = param('id').isMongoId().withMessage('Invalid category id');

// On PUT both fields are optional, but at least one must be sent
const categoryRules = (applyOptional) => {
  const opt = (chain) => (applyOptional ? chain.optional() : chain);

  return [
    opt(body('name').trim().notEmpty().withMessage('Name is required')),
    opt(body('description').trim().notEmpty().withMessage('Description is required')),
  ];
};

const nonEmptyUpdate = body().custom((value, { req }) => {
  const body = req.body ?? {};
  if (!('name' in body) && !('description' in body)) {
    throw new Error('Provide at least one field to update');
  }
  return true;
});

const router = express.Router();

router.get('/', listCategories);

router.get('/:id', [idRule, validate], getCategory);

router.post('/', [...categoryRules(false), validate], createCategory);

router.put(
  '/:id',
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'Category fields to update (at least one is required)',
      required: true,
      schema: {
          name: 'Desserts',
          description: 'Sweet dishes served after a meal'
      }
  } */
  [idRule, ...categoryRules(true), nonEmptyUpdate, validate],
  updateCategory
);

router.delete('/:id', [idRule, validate], deleteCategory);

module.exports = router;
