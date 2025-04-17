const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/verify-authentication", authController.verifyAuthentication);
router.get("/csrf-token", authController.getCSRF);
router.get("/env", (req, res) =>
  res.status(200).json({ env: process.env.NODE_ENV })
);

module.exports = router;
