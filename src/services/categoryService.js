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

  read: async () => {
    const categories = await models.Category.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
    return categories;
  },

};

module.exports = categoryService;