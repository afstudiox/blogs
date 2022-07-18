const Joi = require('joi');
const models = require('../database/models');

const categoryService = {
  validateBody: async (data) => {
    const schema = Joi.object({
      name: Joi.string().required().min(1),
    });
    const result = await schema.validateAsync(data);
    return result;
  },

  create: async (data) => {
    const newCategory = await models.Category.create(data);
    const newCategoryJson = newCategory.toJSON();
    const { createdAt, updatedAt, ...category } = newCategoryJson; 
    return category;
  },

};

module.exports = categoryService;