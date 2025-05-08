// @ts-nocheck
const requireRole = require('../../middlewares/validateRole');
const backendErrorsMap = require('../../utils/errorNames');

describe('requireRole middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 403 if no user is attached to request', () => {
    const middleware = requireRole(['admin', 'user']);

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: backendErrorsMap.INSUFFICIENT_ROLE,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if user role is not allowed', () => {
    req.user = { role: 'guest' };
    const middleware = requireRole(['admin', 'user']);

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: backendErrorsMap.INSUFFICIENT_ROLE,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if user has an allowed role', () => {
    req.user = { role: 'admin' };
    const middleware = requireRole(['admin', 'user']);

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should work correctly with a single allowed role', () => {
    req.user = { role: 'user' };
    const middleware = requireRole(['user']);

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
