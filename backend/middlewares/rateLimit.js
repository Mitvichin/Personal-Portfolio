const { Ratelimit } = require('@upstash/ratelimit');
const backendErrorsMap = require('../utils/errorNames');
const redis = require('../config/redis');

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(150, '60 s'),
});

const rateLimitMiddleware = async (req, res, next) => {
  const ip = req.ip || 'anonymous';

  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return res.status(429).json({ message: backendErrorsMap.RATE_LIMITED });
  }

  next();
};

module.exports = rateLimitMiddleware;
