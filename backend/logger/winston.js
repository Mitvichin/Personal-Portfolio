const winston = require('winston');
const { IS_PROD, IS_DEV } = require('../utils/constants');
require('winston-mongodb');

const mongoURI = process.env.LOGGER_DATABASE_URL;
let mongoLoggerTransport = undefined;

console.log('111111111111', process.env.LOGGER_DATABASE_URL);

const sensitiveDataProps = {
  password: true,
};

const getLogMetaData = (req, error) => {
  for (let key in req.body) {
    if (sensitiveDataProps[key]) {
      req.body[key] = '****';
    }
  }

  return {
    stack: error.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
  };
};

const logger = winston.createLogger({
  level: 'info',
  transports: [],
});

if (IS_PROD || IS_DEV) {
  mongoLoggerTransport = new winston.transports.MongoDB({
    db: mongoURI,
    collection: IS_PROD
      ? process.env.LOGGER_COLLECTION
      : process.env.LOGGER_DEV_COLLECTION,
    level: 'info',
  });

  logger.add(mongoLoggerTransport);
}

if (IS_DEV) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.simple(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} ${level}: ${message}`;
        }),
      ),
      level: 'debug',
    }),
  );
}

module.exports = { logger, mongoLoggerTransport, getLogMetaData };
