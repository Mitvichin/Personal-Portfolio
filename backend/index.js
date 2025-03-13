const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Allows parsing of JSON requests

// Serve the static files from the React app

// API endpoint
app.post("/api/message", (req, res) => {
  res.sendStatus(200);
});

app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Handle requests by serving index.html for all routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
