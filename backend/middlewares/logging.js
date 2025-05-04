const backendErrorsMap = require('../utils/errorNames');
const { logger } = require('../logger/winston.js');

const sensitiveDataProps = {
  password: true,
};

const logging = (error, req, res, next) => {
  for (let key in req.body) {
    if (sensitiveDataProps[key]) {
      req.body[key] = '****';
    }
  }

  logger.error(`Error: ${error.message}`, {
    stack: error.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
  });

  res.status(500).json({ message: backendErrorsMap.INTERNAL_SERVER_ERROR });
};

module.exports = logging;
