const express = require('express');
const homeController = require('../controllers/home_controller');
const passport = require('passport');

const router = express.Router();

router.get('/', passport.checkAuthentication,passport.checkUserAuthentication, homeController.home);
router.get('/admin_home', passport.checkAdminAuthentication, homeController.adminHome);
router.get('/proff_home', passport.checkProffAuthentication, homeController.proffHome);
router.get('/super_admin', passport.checkSuperAdminAuthentication, homeController.superAdmin);
router.get('/student_list', passport.checkAdminAuthentication, homeController.studentList);

router.get('/sendMessage/:dues', passport.checkAdminAuthentication, homeController.sendMessage);
router.get('/approveDues/:dues', passport.checkAdminAuthentication, homeController.approveDues);
router.get('/approveManyDues/:dues', passport.checkAdminAuthentication, homeController.approveManyDues);
router.get('/sendBtpRequest/:obj', passport.checkUserAuthentication, homeController.sendBtpRequest);
router.get('/sendMessageBtp/:dues', passport.checkProffAuthentication, homeController.sendMessageBtp);
router.get('/btpApproved/:dues', passport.checkProffAuthentication, homeController.btpApproved);
router.get('/sendIpRequest/:obj', passport.checkUserAuthentication, homeController.sendIpRequest);
router.get('/sendMessageIp/:dues', passport.checkProffAuthentication, homeController.sendMessageIp);
router.get('/ipApproved/:dues', passport.checkProffAuthentication, homeController.ipApproved);
router.get('/sendBankDetails/:bankDetails', passport.checkAuthentication, homeController.sendBankDetails);
router.get('/sendPersonalDetails/:personalDetails', passport.checkAuthentication, homeController.sendPersonalDetails);

router.get('/download/:obj', passport.checkAuthentication, homeController.download);

router.get('/past/:admin', passport.checkAdminAuthentication, homeController.past);

router.get('/sheet', passport.checkAdminAuthentication,passport.checkSheetAuthentication, homeController.sheet);

router.get('/bankAccountDetails', passport.checkBankAuthentication, homeController.bankAccountDetails);
router.get('/sendPersonalDetails', passport.checkBankAuthentication, homeController.sendPersonalDetails);

router.get('/sendMailToBoysHostelAdmin', passport.checkAuthentication, homeController.sendMailToBoysHostelAdmin);
router.get('/sendMailToGirlsHostelAdmin', passport.checkAuthentication, homeController.sendMailToGirlsHostelAdmin);

router.get('/request/:obj', passport.checkAuthentication, homeController.request);

router.get('/flowchart', passport.checkSuperAdminAuthentication, homeController.flowchart);
router.get('/flowchart/nd', passport.checkSuperAdminAuthentication, homeController.flowchart_nd);
router.get('/nd_controls/mailContents', passport.checkSuperAdminAuthentication, homeController.nd_controls);

router.get('/getFunction', passport.checkAuthentication, homeController.getFunction);

router.get('/showSheet', passport.checkAdminAuthentication,passport.checkSheetAuthentication, homeController.showSheet);

router.use('/user', require('./user'));

router.all('*', function(req, res) {
    res.status(404).send("Sorry! Couldn't find this URL");
});

module.exports = router;