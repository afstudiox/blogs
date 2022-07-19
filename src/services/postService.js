const Joi = require('joi');
const { sequelize } = require('../database/models');
const models = require('../database/models');
const categoryService = require('./categoryService');

const postService = { 
  validateBody: async (data) => {
    const schema = Joi.object({
      title: Joi.string().required(),
      content: Joi.string().required(),
      categoryIds: Joi.array().min(1).messages({ 
        'array.min': 'Some required fields are missing' }),
    }).messages({ 'string.empty': 'Some required fields are missing' });
    const result = await schema.validateAsync(data);
    return result;
  },

  checkCategories: async ({ categoryIds }) => {
    await Promise.all(categoryIds.map((id) => categoryService.readById(id))); 
  },

  create: async (data) => {
    const { userId, title, content, categoryIds } = data;
    const result = await sequelize.transaction(async (t) => {
      const post = await models.BlogPost.create({ 
        title, content, userId,
      }, { transaction: t });
      await categoryIds.map(async (category) => models.PostCategory.create({
        postId: post.id,
        categoryId: category,
      }), { transaction: t });
      return post;
    });
  return result;
  },

};

module.exports = postService;