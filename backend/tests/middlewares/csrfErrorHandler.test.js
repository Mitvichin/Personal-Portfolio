// @ts-nocheck
const csrfErrorHandler = require('../../middlewares/csrfErrorHandler');
const backendErrorsMap = require('../../utils/errorNames');
const { invalidCsrfTokenError } = require('../../config/csrf');
const { CSRF_TOKEN_NAME } = require('../../utils/constants');

describe('csrfErrorHandler', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      clearCookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should handle CSRF token error and respond with appropriate message', () => {
    csrfErrorHandler(invalidCsrfTokenError, req, res, next);

    expect(res.clearCookie).toHaveBeenCalledWith(CSRF_TOKEN_NAME);
    expect(res.status).toHaveBeenCalledWith(invalidCsrfTokenError.statusCode);
    expect(res.json).toHaveBeenCalledWith({
      message: backendErrorsMap.CSRF_INVALID_TOKEN,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with error if not a CSRF token error', () => {
    const otherError = new Error('Some other error');
    csrfErrorHandler(otherError, req, res, next);

    expect(res.clearCookie).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(otherError);
  });
});
