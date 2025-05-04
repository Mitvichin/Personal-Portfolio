const express = require('express');
const userController = require('../controllers/userController');
const verifyAuthentication = require('../middlewares/verifyAuthentication');
const validateRole = require('../middlewares/validateRole');

const router = express.Router();

router.use(verifyAuthentication, validateRole('admin'));
router.get('/', userController.getUsers);
router.delete('/', userController.deleteUserById);

module.exports = router;
