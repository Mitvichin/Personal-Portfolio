// __mocks__/winston.js
const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};

const createLogger = jest.fn(() => mockLogger);

module.exports = {
  createLogger,
  transports: {
    Console: jest.fn(),
    MongoDB: jest.fn(),
  },
};
