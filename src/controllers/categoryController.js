const categoryService = require('../services/categoryService');

const categoryController = {
  /** @type {import('express').RequestHandler} */
  create: async (req, res) => {
    const data = await categoryService.validateBody(req.body);
    const newCategory = await categoryService.create(data);
    res.status(201).json(newCategory);
  },
  read: async (_req, res) => {
    const categories = await categoryService.read();
    res.status(200).json(categories);
  },
};
module.exports = categoryController;