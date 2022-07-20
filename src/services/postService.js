const Joi = require('joi');
const { sequelize } = require('../database/models');
const models = require('../database/models');
const categoryService = require('./categoryService');
const { throwUnauthorizedError, thrownNotFoundError } = require('./utils');

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

  validateBodyUpdate: async (data) => {
    const schema = Joi.object({
      title: Joi.string().required(),
      content: Joi.string().required(),
    }).messages({ 'string.empty': 'Some required fields are missing' });
    const result = await schema.validateAsync(data);
    return result;
  },

  checkUserOwner: async (parmId, userId) => {
    if (Number(parmId) !== userId) throwUnauthorizedError('Unauthorized user');
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

  read: async () => {
     const posts = await models.BlogPost.findAll({
      include: [
        { model: models.User,
          as: 'user',
          attributes: { exclude: ['createdAt', 'updatedAt', 'password'] }, 
        },
        { model: models.Category,
          through: { attributes: [] },
          as: 'categories',
          attributes: { exclude: ['createdAt', 'updatedAt'] }, 
        },
      ],
     });
    return posts;
  },

  readId: async ({ id }) => {
    const post = await models.BlogPost.findOne({
      where: { id },
      include: [
        { model: models.User,
          as: 'user',
          attributes: { exclude: ['createdAt', 'updatedAt', 'password'] }, 
        },
        { model: models.Category,
          through: { attributes: [] },
          as: 'categories',
          attributes: { exclude: ['createdAt', 'updatedAt'] }, 
        },
      ],
    });
    if (!post) thrownNotFoundError('Post does not exist');
    return post;
  },

  update: async (id, data) => {
    const { title, content } = data;
    // enviar as alterações para ao record especifico
    await models.BlogPost.update({ title, content }, { where: { id } });
    // buscar as informações alteradas e retorna
    const postUpdated = await postService.readId({ id });
    return postUpdated;
  },

  delete: async (id) => { 
    const postDeleted = await models.BlogPost.destroy({
      where: { id },
    });
    return postDeleted;
  },

};

module.exports = postService;