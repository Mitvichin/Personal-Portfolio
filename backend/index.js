// @ts-nocheck
require('dotenv').config({ path: './.env' });
const pool = require('./config/db');
const { mongoLoggerTransport, logger } = require('./logger/winston');
const app = require('./app.js');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});

const closeConnections = async () => {
  await pool.end();

  if (mongoLoggerTransport?.client) {
    await mongoLoggerTransport?.client.close();
  }
};

process.on('uncaughtException', async (err) => {
  logger.error('Uncaught Exception:', {
    message: err.message,
    stack: err.stack,
  });

  try {
    await closeConnections();
  } catch (error) {
    logger.error('Uncaught Exception:', {
      message: error.message,
      stack: error.stack,
    });
  }

  server.close();

  setTimeout(() => {
    process.exit(1);
  }, 10000);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection:', {
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined,
  });

  server.close();

  setTimeout(() => {
    process.exit(1);
  }, 10000);
});

process.on('SIGINT', async () => {
  try {
    await closeConnections();
  } catch (error) {
    logger.error('Uncaught Exception:', {
      message: error.message,
      stack: error.stack,
    });
  }

  server.close();

  setTimeout(() => {
    process.exit(0);
  }, 10000);
});

process.on('SIGTERM', async () => {
  try {
    await closeConnections();
  } catch (error) {
    logger.error('Uncaught Exception:', {
      message: error.message,
      stack: error.stack,
    });
  }
  server.close();

  setTimeout(() => {
    process.exit(0);
  }, 10000);
});

module.exports = server;
