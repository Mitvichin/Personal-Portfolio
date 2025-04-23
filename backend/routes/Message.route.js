const express = require('express');
const messageController = require('../controllers/messageController');
const verifyAuthentication = require('../middlewares/verifyAuthentication');

const router = express.Router();

router.use(verifyAuthentication);
router.post('/', messageController.createMessage);
router.get('/', messageController.getMessages);

module.exports = router;
