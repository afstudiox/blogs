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
    // console.log(user.toJSON());
    // gera o token para retornar ao usuário
    const token = await userService.makeToken(user.toJSON());
    // retorna o token ao usuário
    res.status(201).json({ token });
  },
};

module.exports = userController;