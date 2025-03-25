const { Ratelimit } = require("@upstash/ratelimit");
const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(20, "60 s"),
});

async function rateLimitMiddleware(req, res, next) {
  const ip = req.ip || "anonymous";

  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return res
      .status(429)
      .json({ message: "Too many requests. Try again later." });
  }

  next();
}

module.exports = rateLimitMiddleware;
