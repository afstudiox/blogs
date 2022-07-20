const Joi = require('joi');
const { Op } = require('sequelize');
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

  // https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
  readQuery: async (query) => {
    const search = await models.BlogPost.findAll({
      where: { [Op.or]: [
        { title: { [Op.like]: `%${query}%` } },
        { content: { [Op.like]: `%${query}%` } },
      ] },
      include: [
        { model: models.User,
           as: 'user',
          attributes: { exclude: ['createdAt', 'updatedAt', 'password'] }, 
        },
        { model: models.Category,
          through: { attributes: [] },
          as: 'categories',
          attributes: { exclude: ['createdAt', 'updatedAt'] }, 
        }],
    });
    return search;
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
    await models.BlogPost.destroy({
      where: { id },
    });
  },

};

module.exports = postService;