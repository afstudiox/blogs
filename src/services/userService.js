const Joi = require('joi');
const models = require('../database/models');
const { throwUniqueConstraintError } = require('./utils');

const userService = {
  validateBodyUser: async (data) => {
    const schema = Joi.object({
      displayName: Joi.string().required().min(8),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
      image: Joi.string().required(),
    });
    const result = await schema.validateAsync(data);
    return result;
  },
  
  // verifica se o usuario existe no banco de dados
  userExist: async ({ email }) => {
    const user = await models.User.findOne({ where: { email }, raw: true });
    if (user !== null) throwUniqueConstraintError('User already registered');
  },

  // cria o usuario no banco de dados
  createUser: async (data) => {
    const result = await models.User.create(data);
    return result;
  },

  readUsers: async () => {
    const users = await models.User.findAll({
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'],
      },
    });
    return users;
  },

  getUserById: async (id) => {
    const user = await models.User.findByPk(id);
    const userJson = user.toJSON();
    return userJson;
  },

};

module.exports = userService;