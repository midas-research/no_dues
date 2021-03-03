const express = require('express');
const homeController = require('../controllers/home_controller');
const passport = require('passport');

const router = express.Router();

router.get('/', passport.checkAuthentication, homeController.home);

router.use('/user', require('./user'));

module.exports = router;