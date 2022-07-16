const thrownNotFoundError = (message) => {
  const err = new Error(message);
  err.name = 'NotFoundError';
  throw err;
};

const throwUnauthorizedError = (message) => {
  const err = new Error(message);
  err.name = 'UnauthorizedError';
  throw err;
};

const throwValidationError = (message) => {
  const err = new Error(message);
  err.name = 'ValidationError';
  throw err;
};

const throwUniqueConstraintError = (message) => {
  const err = new Error(message);
  err.name = 'UniqueConstraintError';
  throw err;
};

module.exports = {
  thrownNotFoundError,
  throwUnauthorizedError,
  throwValidationError,
  throwUniqueConstraintError,
};