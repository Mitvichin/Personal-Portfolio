const backendErrorsMap = require('../utils/errorNames');

const { invalidCsrfTokenError } = require('../config/csrf');
const { CSRF_TOKEN_NAME } = require('../utils/constants');

const csrfErrorHandler = (error, req, res, next) => {
  if (error === invalidCsrfTokenError) {
    res.clearCookie(CSRF_TOKEN_NAME);

    res
      .status(error.statusCode)
      .json({ message: backendErrorsMap.CSRF_INVALID_TOKEN });
  } else {
    next(error);
  }
};

module.exports = csrfErrorHandler;
