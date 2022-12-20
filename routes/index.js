const express = require('express');
const homeController = require('../controllers/home_controller');
const passport = require('passport');

const router = express.Router();

router.get('/', passport.checkAuthentication,passport.checkUserAuthentication, homeController.home);

router.get('/super_admin', passport.checkSuperAdminAuthentication, homeController.superAdmin);
router.get('/super_admin/adminRequests', passport.checkSuperAdminAuthentication, homeController.superAdminDepartment);
router.get('/superSendMessage/:dues', passport.checkSuperAdminAuthentication, homeController.superSendMessage);
router.get('/superApproveDues/:dues', passport.checkSuperAdminAuthentication, homeController.superApproveDues);
router.get('/superApproveManyDues/:dues', passport.checkSuperAdminAuthentication, homeController.superApproveManyDues);
router.get('/super_admin/approveAdmin/:dues', passport.checkSuperAdminAuthentication, homeController.approveAdmin);
router.get('/super_admin/approveManyAdmins/:dues', passport.checkSuperAdminAuthentication, homeController.approveManyAdmins);
router.get('/super_admin/sendAdminMessage/:dues', passport.checkSuperAdminAuthentication, homeController.sendAdminMessage);

router.get('/admin_home', passport.checkAdminAuthentication, homeController.adminHome);
router.get('/sendMessage/:dues', passport.checkAdminAuthentication, homeController.sendMessage);
router.get('/approveDues/:dues', passport.checkAdminAuthentication, homeController.approveDues);
router.get('/approveManyDues/:dues', passport.checkAdminAuthentication, homeController.approveManyDues);
router.get('/sheet', passport.checkAdminAuthentication,passport.checkSheetAuthentication, homeController.sheet);
router.get('/past/:admin', passport.checkAdminAuthentication, homeController.past);
router.get('/showSheet', passport.checkAdminAuthentication,passport.checkSheetAuthentication, homeController.showSheet);

router.get('/proff_home', passport.checkProffAuthentication, homeController.proffHome);
router.get('/sendMessageBtp/:dues', passport.checkProffAuthentication, homeController.sendMessageBtp);
router.get('/sendMessageIp/:dues', passport.checkProffAuthentication, homeController.sendMessageIp);
router.get('/ipApproved/:dues', passport.checkProffAuthentication, homeController.ipApproved);
router.get('/btpApproved/:dues', passport.checkProffAuthentication, homeController.btpApproved);
router.get('/approveManyProffs/:dues', passport.checkProffAuthentication, homeController.approveManyProffs);

router.get(`/ipApprovedMail/:proffEmail/:studentId`,homeController.ipApprovedThroughMail);
router.get(`/btpApprovedMail/:proffEmail/:studentId`,homeController.btpApprovedThroughMail);
router.get(`/ip/btp/:status`,homeController.afterMailPage);


router.get('/sendBtpRequest/:obj', passport.checkUserAuthentication, homeController.sendBtpRequest);
router.get('/sendIpRequest/:obj', passport.checkUserAuthentication, homeController.sendIpRequest);
router.get('/sendBankDetails/:bankDetails', passport.checkAuthentication, homeController.sendBankDetails);
router.get('/sendPersonalDetails/:personalDetails', passport.checkAuthentication, homeController.sendPersonalDetails);
router.get('/download/:obj', passport.checkAuthentication, homeController.download);


router.get('/bankAccountDetails', passport.checkBankAuthentication, homeController.bankAccountDetails);
router.get('/sendPersonalDetails', passport.checkBankAuthentication, homeController.sendPersonalDetails);
router.get('/sendMailToBoysHostelAdmin', passport.checkAuthentication, homeController.sendMailToBoysHostelAdmin);
router.get('/sendMailToGirlsHostelAdmin', passport.checkAuthentication, homeController.sendMailToGirlsHostelAdmin);
router.get('/request/:obj', passport.checkAuthentication, homeController.request);
router.get('/flowchart', passport.checkSuperAdminAuthentication, homeController.flowchart);
router.get('/flowchart/nd', passport.checkSuperAdminAuthentication, homeController.flowchart_nd);
router.get('/nd_controls/mailContents', passport.checkSuperAdminAuthentication, homeController.nd_controls);
router.get('/getFunction', passport.checkAuthentication, homeController.getFunction);



router.use('/user', require('./user'));

router.all('*', function(req, res) {
    res.status(404).send("Sorry! Couldn't find this URL");
});

module.exports = router;