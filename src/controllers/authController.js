const authService = require('../services/authService');

const authController = {
  /** @type {import('express').RequestHandler} */
  login: async (req, res) => {
    // Valida se os dados do bocy estão corretos
    const data = await authService.validateBodyLogin(req.body);
    // Verifica se o usuário existe no banco, senão dispara um erro
    const user = await authService.checkUserByEmail(data.email);
    // Cria um token e retorna
    const token = await authService.makeToken(user);
    res.json({ token });
  },
};

module.exports = authController;