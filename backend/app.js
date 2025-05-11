// @ts-nocheck
const { API_BASE_URL } = require('./utils/constants.js');
const backendErrorsMap = require('./utils/errorNames');
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const corsConfig = require('./config/cors.js');
const messageRouter = require('./routes/Message.route.js');
const userRouter = require('./routes/User.route.js');
const gridRouter = require('./routes/Grid.route.js');
const authRouter = require('./routes/Auth.route.js');
const githubRouter = require('./routes/Github.route.js');
const csrf = require('./config/csrf.js');
const rateLimitMiddleware = require('./middlewares/rateLimit.js');
const cookieParserMiddleware = require('cookie-parser');
const csrfErrorMiddleware = require('./middlewares/csrfErrorHandler.js');
const loggingMiddleware = require('./middlewares/logging.js');

const app = express();

// Middleware
app.use(helmet());
app.use(cors(corsConfig));
app.use(cookieParserMiddleware());
app.use(express.json());
app.use(API_BASE_URL, rateLimitMiddleware);

// API endpoint
app.use(`${API_BASE_URL}/message`, csrf.doubleCsrfProtection, messageRouter);
app.use(`${API_BASE_URL}/user`, csrf.doubleCsrfProtection, userRouter);
app.use(`${API_BASE_URL}/grid`, gridRouter);
app.use(`${API_BASE_URL}/auth`, csrf.doubleCsrfProtection, authRouter);
app.use(`${API_BASE_URL}/github`, csrf.doubleCsrfProtection, githubRouter);
app.use(`${API_BASE_URL}/*`, (req, res) => {
  res.status(404).json({ message: backendErrorsMap.NOT_FOUND });
  return;
});

app.use(csrfErrorMiddleware);
app.use(loggingMiddleware);

app.use(express.static(path.join(__dirname, 'public')));

// Handle requests by serving index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;
