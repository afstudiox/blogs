const errors = {
  ValidationError: 400,
  UnauthorizedError: 401,
  NotFoundError: 404,
  UniqueConstraintError: 409,
};

 const errorHandlerMiddleware = ({ name, message }, _req, res, _next) => {
  // console.log('\n error name e message\n', name, message);
  const status = errors[name];
  if (!status) return res.sendStatus(500);
  res.status(status).json({ message });
};

module.exports = errorHandlerMiddleware;