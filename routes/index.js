const express = require('express');
const homeController = require('../controllers/home_controller');
const passport = require('passport');

const router = express.Router();

router.get('/', passport.checkAuthentication, homeController.home);
router.get('/admin_home', passport.checkAuthentication, homeController.adminHome);
router.get('/proff_home', passport.checkAuthentication, homeController.proffHome);
router.get('/student_list', passport.checkAuthentication, homeController.studentList);

router.get('/sendMessage/:dues', passport.checkAuthentication, homeController.sendMessage);
router.get('/approveDues/:dues', passport.checkAuthentication, homeController.approveDues);
router.get('/sendBtpRequest/:obj', passport.checkAuthentication, homeController.sendBtpRequest);
router.get('/sendMessageBtp/:dues', passport.checkAuthentication, homeController.sendMessageBtp);
router.get('/btpApproved/:dues', passport.checkAuthentication, homeController.btpApproved);
router.get('/sendIpRequest/:obj', passport.checkAuthentication, homeController.sendIpRequest);
router.get('/sendMessageIp/:dues', passport.checkAuthentication, homeController.sendMessageIp);
router.get('/ipApproved/:dues', passport.checkAuthentication, homeController.ipApproved);

router.get('/download/:user', passport.checkAuthentication, homeController.download);

router.use('/user', require('./user'));

module.exports = router;