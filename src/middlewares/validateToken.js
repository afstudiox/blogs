const authService = require('../services/authService');
const { throwUnauthorizedError } = require('../services/utils');

const clearToken = (data) => { // função para deixar só o token
  const [, token] = data.split(' ');
  return token;
};

const validateToken = async (req, _res, next) => {
  const token = req.headers.authorization;
    if (!token) throwUnauthorizedError('Token not found');
  const newToken = clearToken(token);
  try {
    await authService.readToken(newToken);
  } catch (error) {
    throwUnauthorizedError('Expired or invalid token');
  }
  next();
};

module.exports = validateToken;
