const backendErrorsMap = require('../utils/errorNames');
const { logger, getLogMetaData } = require('../logger/winston.js');

const logging = (error, req, res, next) => {
  logger.error(`Error: ${error.message}`, getLogMetaData(req, error));

  res.status(500).json({ message: backendErrorsMap.INTERNAL_SERVER_ERROR });
};

module.exports = logging;
