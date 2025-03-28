const express = require("express");
const path = require("path");
const cors = require("cors");
const messageRouter = require("./routes/Message.route.js");
const gridRouter = require("./routes/Grid.route.js");
const authRouter = require("./routes/Auth.route.js");
const rateLimitMiddleware = require("./middlewares/rate-limit.js");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Allows parsing of JSON requests
app.use("/api", rateLimitMiddleware); // Rate limitting

// API endpoint
app.use("/api/message", messageRouter);
app.use("/api/grid", gridRouter);
app.use("/api/auth", authRouter);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Handle requests by serving index.html for all routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
