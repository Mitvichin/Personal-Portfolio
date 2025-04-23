const express = require("express");
const githubController = require("../controllers/githubController");

const router = express.Router();

router.get("/get-file-content", githubController.getFileContent);

module.exports = router;
