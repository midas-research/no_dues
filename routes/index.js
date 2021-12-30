const express = require('express');
const homeController = require('../controllers/home_controller');
const passport = require('passport');

const router = express.Router();

router.get('/', passport.checkAuthentication, homeController.home);
router.get('/admin_home', passport.checkAuthentication, homeController.adminHome);
router.get('/proff_home', passport.checkAuthentication, homeController.proffHome);
router.get('/super_admin', passport.checkAuthentication, homeController.superAdmin);
router.get('/student_list', passport.checkAuthentication, homeController.studentList);

router.get('/sendMessage/:dues', passport.checkAuthentication, homeController.sendMessage);
router.get('/approveDues/:dues', passport.checkAuthentication, homeController.approveDues);
router.get('/approveManyDues/:dues', passport.checkAuthentication, homeController.approveManyDues);
router.get('/sendBtpRequest/:obj', passport.checkAuthentication, homeController.sendBtpRequest);
router.get('/sendMessageBtp/:dues', passport.checkAuthentication, homeController.sendMessageBtp);
router.get('/btpApproved/:dues', passport.checkAuthentication, homeController.btpApproved);
router.get('/sendIpRequest/:obj', passport.checkAuthentication, homeController.sendIpRequest);
router.get('/sendMessageIp/:dues', passport.checkAuthentication, homeController.sendMessageIp);
router.get('/ipApproved/:dues', passport.checkAuthentication, homeController.ipApproved);
router.get('/sendBankDetails/:bankDetails', passport.checkAuthentication, homeController.sendBankDetails);
router.get('/sendPersonalDetails/:personalDetails', passport.checkAuthentication, homeController.sendPersonalDetails);

router.get('/download/:obj', passport.checkAuthentication, homeController.download);

router.get('/past/:admin', passport.checkAuthentication, homeController.past);

router.get('/sheet', passport.checkSheetAuthentication, homeController.sheet);

router.get('/bankAccountDetails', passport.checkBankAuthentication, homeController.bankAccountDetails);
router.get('/sendPersonalDetails', passport.checkBankAuthentication, homeController.sendPersonalDetails);

router.get('/sendMailToBoysHostelAdmin', passport.checkAuthentication, homeController.sendMailToBoysHostelAdmin);
router.get('/sendMailToGirlsHostelAdmin', passport.checkAuthentication, homeController.sendMailToGirlsHostelAdmin);

router.get('/request/:obj', passport.checkAuthentication, homeController.request);

router.get('/flowchart', passport.checkSuperAdminAuthentication, homeController.flowchart);
router.get('/flowchart/nd', passport.checkSuperAdminAuthentication, homeController.flowchart_nd);
router.get('/nd_controls', passport.checkSuperAdminAuthentication, homeController.nd_controls);

router.get('/getFunction', passport.checkAuthentication, homeController.getFunction);

router.use('/user', require('./user'));

module.exports = router;