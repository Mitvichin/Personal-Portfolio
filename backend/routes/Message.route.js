const express = require('express');
const messageController = require('../controllers/messageController');
const verifyAuthentication = require('../middlewares/verifyAuthentication');
const validateRole = require('../middlewares/validateRole');

const router = express.Router();

router.use(verifyAuthentication);
router.post('/', messageController.createMessage);
router.get('/', messageController.getMessages);
router.delete('/', validateRole('admin'), messageController.deleteMessage);

module.exports = router;
