const { IS_LOCAL } = require('../utils/constants');

const corsConfig = {
  origin: function (origin, callback) {
    const allowedOrigins = [process.env.CROSSWORD_GENERATOR_URL];

    if ((!origin && IS_LOCAL) || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
};

module.exports = corsConfig;
