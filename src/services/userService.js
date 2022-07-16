const Joi = require('joi');
const jwt = require('jsonwebtoken');
const models = require('../database/models');
const { throwUniqueConstraintError } = require('./utils');

const secret = process.env.JWT_SECRET;

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

  // cria o token e retorna ao controller
  makeToken: async (userCreated) => {
    const payload = userCreated;
    const token = jwt.sign(payload, secret);
    return token;
  },
};

module.exports = userService;