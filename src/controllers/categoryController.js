const categoryService = require('../services/categoryService');

const categoryController = {
  /** @type {import('express').RequestHandler} */
  create: async (req, res) => {
    const data = await categoryService.validateBody(req.body);
    const newCategory = await categoryService.create(data);
    res.status(201).json(newCategory);
  },
};
module.exports = categoryController;