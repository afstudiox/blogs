const authService = require('../services/authService');

const authController = {
  /** @type {import('express').RequestHandler} */
  login: async (req, res) => {
    // Será validado que não é possível fazer login sem todos os campos preenchidos
    const data = await authService.validateBodyLogin(req.body);
    // Será validado que não é possível fazer login com um usuário que não existe
    const user = await authService.checkUserByEmail(data.email);
    // Será validado que é possível fazer login com sucesso
    await authService.verifyUserPassword(data.password, user.password);
    // Gerado um token e retorna pelo res
    const token = await authService.makeToken(user);
    res.json({ token });
  },
};

module.exports = authController;