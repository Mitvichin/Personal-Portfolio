const backendErrorsMap = require('../utils/errorNames');

const { invalidCsrfTokenError } = require('../config/csrf');
const csrfErrorHandler = (error, req, res, next) => {
  if (error === invalidCsrfTokenError) {
    res
      .status(error.statusCode)
      .json({ message: backendErrorsMap.CSRF_INVALID_TOKEN });
  } else {
    next(error);
  }
};

module.exports = csrfErrorHandler;
