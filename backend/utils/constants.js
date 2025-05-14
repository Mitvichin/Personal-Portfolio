const JWT_TOKEN_NAME = '__Host_mitvichin_portfolio_auth_token';
const JWT_REFRESH_TOKEN_NAME = '__Host_mitvichin_portfolio_refresh_auth_token';
const VISITOR_ID_NAME = '__Host_mitvichin_portfolio_visitor_id';
const CSRF_TOKEN_NAME = '__Host_mitvichin_portfolio_csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';
const IS_PROD = process.env.NODE_ENV === 'production';
const IS_DEV = process.env.NODE_ENV === 'development';
const IS_LOCAL = process.env.NODE_ENV === 'local';
const IS_TEST = process.env.NODE_ENV === 'test';
const CACHE_TIME = 60; //seconds

const API_BASE_URL = '/api';

module.exports = {
  JWT_TOKEN_NAME,
  JWT_REFRESH_TOKEN_NAME,
  CSRF_TOKEN_NAME,
  API_BASE_URL,
  VISITOR_ID_NAME,
  IS_PROD,
  IS_DEV,
  CSRF_HEADER_NAME,
  CACHE_TIME,
  IS_LOCAL,
  IS_TEST,
};
