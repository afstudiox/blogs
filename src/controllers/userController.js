const authService = require('../services/authService');
const userService = require('../services/userService');

const userController = {
  /** @type {import('express').RequestHandler} */
  createUser: async (req, res) => {
    // valida os dados revebidos peolo body
    const data = await userService.validateBodyUser(req.body);
    // verifica se o usuário já esta cadastrado
    await userService.userExist(data);
    // cria o usuário no banco de dados
    const user = await userService.createUser(data);
    const userJson = user.toJSON();
    // gera o token para retornar ao usuário
    const token = await authService.makeToken(userJson);
    // retorna o token ao usuário
    res.status(201).json({ token });
  },

  readUsers: async (req, res) => {
    const users = await userService.readUsers();
    res.status(200).json(users);
  },

  get: async (req, res) => {
    const user = await userService.getUserById(req.params);
    res.status(200).json(user);
  },

  delete: async (req, res) => {
    const { id } = await authService.readToken(req.headers.authorization);
    console.log(id);
    await userService.delete(id);
    return res.status(204);
  },
  
};

module.exports = userController;