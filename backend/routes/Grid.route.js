const express = require("express");
const gridController = require("../controllers/gridController");

const router = express.Router();

router.post("/", gridController.createGrid);

module.exports = router;
