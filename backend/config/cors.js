const allowedOrigins = [process.env.CROSSWORD_GENERATOR_URL];

const isDev = process.env.NODE_ENV !== 'production';

const corsConfig = {
  origin: function (origin, callback) {
    if ((!origin && isDev) || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
};

module.exports = corsConfig;
