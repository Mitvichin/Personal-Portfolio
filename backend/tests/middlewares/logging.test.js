// @ts-nocheck
const logging = require('../../middlewares/logging');
const backendErrorsMap = require('../../utils/errorNames');
const { logger, getLogMetaData } = require('../../logger/winston');

jest.mock('../../logger/winston', () => ({
  logger: {
    error: jest.fn(),
  },
  getLogMetaData: jest.fn(),
}));

describe('logging middleware', () => {
  let req, res, next, error;

  beforeEach(() => {
    req = { method: 'GET', url: '/test' };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    error = new Error('Something went wrong');

    getLogMetaData.mockReturnValue({ mock: 'meta' });
  });

  it('should log the error and return a 500 response', () => {
    logging(error, req, res, next);

    expect(logger.error).toHaveBeenCalledWith(`Error: ${error.message}`, {
      mock: 'meta',
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: backendErrorsMap.INTERNAL_SERVER_ERROR,
    });
    expect(next).not.toHaveBeenCalled();
  });
});
