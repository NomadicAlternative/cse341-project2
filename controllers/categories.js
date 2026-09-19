// Data model
const Category = require('../models/Category');
// Custom error type for expected HTTP failures
const HttpError = require('../utils/HttpError');

// GET /categories — alphabetical order
const listCategories = async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.status(200).json(categories);
};

// GET /categories/:id — single category or 404
const getCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new HttpError(404, 'Category not found');
  }
  res.status(200).json(category);
};

// POST /categories
const createCategory = async (req, res) => {
  const category = new Category({
    name: req.body.name,
    description: req.body.description,
  });
  const saved = await category.save();
  res.status(201).json(saved);
};

// PUT /categories/:id — partial update of the two editable fields
const updateCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new HttpError(404, 'Category not found');
  }

  const editable = ['name', 'description'];
  for (const key of editable) {
    if (key in req.body) {
      category[key] = req.body[key];
    }
  }

  const saved = await category.save();
  res.status(200).json(saved);
};

// DELETE /categories/:id — 204 on success, 404 when the id does not exist
const deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    throw new HttpError(404, 'Category not found');
  }
  res.status(204).send();
};

module.exports = {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
