// @ts-nocheck
jest.mock('../../config/redis');

const redis = require('../../config/redis');
const redisCache = require('../../middlewares/redisCache');

describe('redisCache middleware', () => {
  let req, res, next;

  beforeEach(() => {
    jest.mock('../../config/redis', () => ({
      get: jest.fn(),
      set: jest.fn(),
    }));
    req = { originalUrl: '/test' };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should return cached response if exists', async () => {
    redis.get.mockResolvedValue({ message: 'cached!' });

    await redisCache(req, res, next);

    expect(redis.get).toHaveBeenCalledWith('/test');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'cached!' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if cache does not exist', async () => {
    redis.get.mockResolvedValue(null);

    await redisCache(req, res, next);

    expect(redis.get).toHaveBeenCalledWith('/test');
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should handle errors and call next', async () => {
    redis.get.mockRejectedValue(new Error('Redis down'));

    await redisCache(req, res, next);

    expect(redis.get).toHaveBeenCalledWith('/test');
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
