const authService = require('../services/authService');
const { throwUnauthorizedError } = require('../services/utils');

const validateToken = async (req, _res, next) => {
  const token = req.headers.authorization;
    if (!token) throwUnauthorizedError('Token not found');
  try {
    await authService.readToken(token);
  } catch (error) {
    throwUnauthorizedError('Expired or invalid token');
  }
  next();
};

module.exports = validateToken;
