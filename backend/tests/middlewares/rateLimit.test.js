// @ts-nocheck
const rateLimitMiddleware = require('../../middlewares/rateLimit');
const backendErrorsMap = require('../../utils/errorNames');

jest.mock('@upstash/ratelimit', () => {
  const mockLimit = jest.fn();
  const fixedWindowMock = jest
    .fn()
    .mockReturnValue({ strategy: 'fixedWindow' });

  const RatelimitConstructor = function (config) {
    return {
      limit: mockLimit,
      limiter: config.limiter,
    };
  };

  RatelimitConstructor.fixedWindow = fixedWindowMock;

  return {
    Ratelimit: RatelimitConstructor,
    mockLimit,
    fixedWindowMock,
  };
});

jest.mock('@upstash/redis', () => ({
  Redis: jest.fn().mockImplementation(() => ({})),
}));

const { mockLimit, fixedWindowMock } = require('@upstash/ratelimit');

describe('rateLimitMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { ip: '127.0.0.1' };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow the request if not rate limited', async () => {
    mockLimit.mockResolvedValue({ success: true });

    await rateLimitMiddleware(req, res, next);

    expect(mockLimit).toHaveBeenCalledWith('127.0.0.1');
    expect(res.status).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
    expect(fixedWindowMock).toHaveBeenCalled();
    expect(fixedWindowMock).toHaveBeenCalled();
  });

  it('should block the request if rate limited', async () => {
    mockLimit.mockResolvedValue({ success: false });

    await rateLimitMiddleware(req, res, next);

    expect(mockLimit).toHaveBeenCalledWith('127.0.0.1');
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith({
      message: backendErrorsMap.RATE_LIMITED,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should use "anonymous" if req.ip is undefined', async () => {
    req.ip = undefined;
    mockLimit.mockResolvedValue({ success: true });

    await rateLimitMiddleware(req, res, next);

    expect(mockLimit).toHaveBeenCalledWith('anonymous');
    expect(next).toHaveBeenCalled();
  });
});
