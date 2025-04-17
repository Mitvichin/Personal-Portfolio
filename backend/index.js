const { API_BASE_URL } = require("./utils/constants.js");
const express = require("express");
const path = require("path");
const cors = require("cors");
const messageRouter = require("./routes/Message.route.js");
const gridRouter = require("./routes/Grid.route.js");
const authRouter = require("./routes/Auth.route.js");
const rateLimitMiddleware = require("./middlewares/rate-limit.js");
const cookieParser = require("cookie-parser");
const csrf = require("./config/csrf.js");
const csrfErrorHandler = require("./middlewares/csrfErrorHandler.js");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Allows parsing of JSON requests.
app.use(cookieParser());
app.use(API_BASE_URL, rateLimitMiddleware); // Rate limitting
app.use(csrf.doubleCsrfProtection); // csrf protection
app.use(csrfErrorHandler);

// API endpoint
app.use(`${API_BASE_URL}/message`, messageRouter);
app.use(`${API_BASE_URL}/grid`, gridRouter);
app.use(`${API_BASE_URL}/auth`, authRouter);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Handle requests by serving index.html for all routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
