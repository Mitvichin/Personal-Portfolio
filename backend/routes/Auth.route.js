const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/verify-authentication', authController.verifyAuthentication);
router.get('/csrf-token', authController.getCSRF);
router.get('/refresh', authController.refreshAuthToken);

module.exports = router;
