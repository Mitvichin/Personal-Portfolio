const winston = require('winston');
const { IS_PROD, IS_DEV } = require('../utils/constants');
require('winston-mongodb');

const mongoURI = process.env.LOGGER_DATABASE_URL;
let mongoLoggerTransport = undefined;

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

module.exports = { logger, mongoLoggerTransport };
