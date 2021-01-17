const express = require('express');
const userController = require('../controllers/user_controller');

const router = express.Router();

router.get('/profile', userController.profile);

module.exports = router;