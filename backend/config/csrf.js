// @ts-nocheck
const { doubleCsrf } = require('csrf-csrf');
const {
  JWT_TOKEN_NAME,
  CSRF_TOKEN_NAME,
  VISITOR_ID_NAME,
  IS_PROD,
} = require('../utils/constants');

const doubleCsrfOptions = {
  getSecret: () => process.env.CSRF_SECRET || 'default_secret',
  cookieName: CSRF_TOKEN_NAME,
  cookieOptions: {
    httpOnly: true,
    sameSite: 'Strict',
    secure: IS_PROD,
    maxAge: 3600000,
  },
  getSessionIdentifier: (req) =>
    req.cookies[JWT_TOKEN_NAME] || req.cookies[VISITOR_ID_NAME],
  getTokenFromRequest: (req) => req.headers['x-csrf-token'],
};

module.exports = doubleCsrf(doubleCsrfOptions);
