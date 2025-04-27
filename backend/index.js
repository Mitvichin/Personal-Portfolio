const { API_BASE_URL } = require('./utils/constants.js');
const backendErrorsMap = require('./utils/errorNames');
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const corsConfig = require('./config/cors.js');
const messageRouter = require('./routes/Message.route.js');
const gridRouter = require('./routes/Grid.route.js');
const authRouter = require('./routes/Auth.route.js');
const githubRouter = require('./routes/Github.route.js');
const rateLimitMiddleware = require('./middlewares/rate-limit.js');
const cookieParser = require('cookie-parser');
const csrf = require('./config/csrf.js');
const csrfErrorHandler = require('./middlewares/csrfErrorHandler.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors(corsConfig));
app.use(cookieParser());
app.use(express.json()); // Allows parsing of JSON requests.
app.use(API_BASE_URL, rateLimitMiddleware); // Rate limitting
app.use(csrf.doubleCsrfProtection); // csrf protection
app.use(csrfErrorHandler);

// API endpoint
app.use(`${API_BASE_URL}/message`, messageRouter);
app.use(`${API_BASE_URL}/grid`, gridRouter);
app.use(`${API_BASE_URL}/auth`, authRouter);
app.use(`${API_BASE_URL}/github`, githubRouter);
app.use(`${API_BASE_URL}/*`, (req, res) => {
  res.status(404).json({ message: backendErrorsMap.NOT_FOUND });
  return;
});

app.use(express.static(path.join(__dirname, 'public')));

// Handle requests by serving index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
