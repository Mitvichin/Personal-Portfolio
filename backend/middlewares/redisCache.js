const redis = require('../config/redis');

const redisCache = async (req, res, next) => {
  const key = req.originalUrl;
  try {
    const cached = await redis.get(key);

    if (cached) {
      return res.status(200).json(cached);
    }
  } catch (err) {}

  next();
};

module.exports = redisCache;
