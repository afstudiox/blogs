const Joi = require('joi');
const jwt = require('jsonwebtoken');
const models = require('../database/models');
const { throwValidationError, throwUnauthorizedError } = require('./utils');

const secret = process.env.JWT_SECRET; // atribui o secret das variaveis de ambiente na constante secret

const authService = {
  validateBodyLogin: async (unknow) => { // recebe um objeto como parametro para ser testado
    const schema = Joi.object({
      email: Joi.string().required()
        .messages({ 'string.empty': 'Some required fields are missing' }), // verifica se o campo esta vazio
      password: Joi.string().required()
        .messages({ 'string.empty': 'Some required fields are missing' }), // verifica se o campo esta vazio
    });
    const result = await schema.validateAsync(unknow); // executa os testes do joi acima de forma assincrona
    return result; // retorna o objeto de orgin caso tudo seja validado
  },

  checkUserByEmail: async (email) => { // recebe um objeto validado para ser base de busca no banco
    const user = await models.User.findOne({ // função que traz o primeiro item encontrado no banco
      where: { email },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'],
      }, // usa a chave email como parametro de busca
      raw: true }); // converte o resultado para um objeto JSON 
    if (!user) throwValidationError('Invalid fields'); // se não retornar nada dispara um erro ( erro forçado para passar no requisito, fora do padrão restFul )
    return user; // retorna o objeto
  },

  verifyUserPassword: async (passBody, passDb) => { // verifica se a senha esta correta
    try {
      // await bcrypt.compare(passBody, passDb); 
      if (passBody === passDb) return true;
    } catch (error) {
      throwUnauthorizedError('Invalid fields');
    }
  },

  makeToken: async (payload) => { // recebe um objeto validado
    const token = jwt.sign(payload, secret); // criar um token com o JWT adicionando o secret
    return token; // retorna o token 
  },

  readToken: async (token) => { // recebe um token
      const user = jwt.verify(token, secret);
      return user;
  },

};
  
module.exports = authService;