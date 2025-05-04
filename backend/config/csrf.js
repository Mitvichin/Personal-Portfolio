const { doubleCsrf } = require('csrf-csrf');
const {
  JWT_TOKEN_NAME,
  CSRF_TOKEN_NAME,
  VISITOR_ID_NAME,
} = require('../utils/constants');

const isProd = process.env.NODE_ENV === 'production';

const doubleCsrfOptions = {
  getSecret: () => process.env.CSRF_SECRET || 'default_secret',
  cookieName: CSRF_TOKEN_NAME,
  cookieOptions: {
    httpOnly: true,
    sameSite: 'Strict',
    secure: isProd,
  },
  getSessionIdentifier: (req) =>
    req.cookies[JWT_TOKEN_NAME] || req.cookies[VISITOR_ID_NAME],
  getTokenFromRequest: (req) => req.headers['x-csrf-token'],
};

module.exports = doubleCsrf(doubleCsrfOptions);
