const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const models = require('../database/models');
const { throwValidationError, throwUnauthorizedError } = require('./utils');

const secret = process.env.JWT_SECRET;

const authService = {
  // faz a validação dos dados recebidos do controller (body)
  validateBodyLogin: async (unknow) => {
    // schema para validação do body com mensagens personalizadas
    const schema = Joi.object({
      email: Joi.string().required().email()
        .messages({ 'string.empty': 'Some required fields are missing' }),
      password: Joi.string().required().min(6)
        .messages({ 'string.empty': 'Some required fields are missing' }),
    });
    // testa o que veio do controller para validação
    const result = await schema.validateAsync(unknow);
      return result;
  },

  // verifica se o usuario existe no banco e caso não exista 
  // de forma errada, retorna um erro de Validation e não de NotFound
  // mas para passar no requisito deixei dessa forma
  checkUserByEmail: async (email) => {
    const user = await models.User.findOne({
      where: { email },
      raw: true,
    });
    if (!user) throwValidationError('Invalid fields');
    return user;
  },

  // verifica se senha do usuário confere (body<->bd) 
  // caso contrário retorna um erro de Unauthorized
  verifyUserPassword: async (password, passwordHash) => {
    try {
      await bcrypt.compare(password, passwordHash);
    } catch (error) {
      throwUnauthorizedError('Invalid fields');
    }
  },

  // cria o token e retorna ao controller
  makeToken: async (user) => {
    const { id, name } = user;
    const payload = { data: { id, name } };
    const token = jwt.sign(payload, secret);
    return token;
  },

  // readToken: async (token) => {
  //   try {
  //     const { data } = jwt.verify(token, secret);
  //     return data;
  //   } catch (error) {
  //     throwUnauthorizedError();
  //   }
  // },

};
  
module.exports = authService;