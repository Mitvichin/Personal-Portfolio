// @ts-nocheck
const verifyAuthentication = require('../../middlewares/verifyAuthentication');
const backendErrorsMap = require('../../utils/errorNames');
const { JWT_TOKEN_NAME } = require('../../utils/constants');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('verifyAuthentication middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      cookies: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if token is missing', () => {
    verifyAuthentication(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: backendErrorsMap.UNAUTHENTICATED,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    req.cookies[JWT_TOKEN_NAME] = 'invalid-token';
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Invalid token'), null);
    });

    verifyAuthentication(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(
      'invalid-token',
      process.env.JWT_SECRET,
      expect.any(Function),
    );
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: backendErrorsMap.UNAUTHENTICATED,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next and attach user if token is valid', () => {
    req.cookies[JWT_TOKEN_NAME] = 'valid-token';
    const mockUser = { id: 123, role: 'user' };

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { user: mockUser });
    });

    verifyAuthentication(req, res, next);

    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
