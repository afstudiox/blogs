const authService = require('../services/authService');
const { throwUnauthorizedError } = require('../services/utils');

// NÃO USAR O QUE ERA IMPORTANTE 
// const clearToken = (data) => { // função para deixar só o token
//   const [, token] = data.split(' ');
//   return token;
// };

const validateToken = async (req, _res, next) => {
  const token = req.headers.authorization;
    if (!token) throwUnauthorizedError('Token not found');
  // const newToken = clearToken(token);
  try {
    await authService.readToken(token);
  } catch (error) {
    throwUnauthorizedError('Expired or invalid token');
  }
  next();
};

module.exports = validateToken;
