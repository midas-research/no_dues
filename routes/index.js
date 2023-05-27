const express = require("express");
const homeController = require("../controllers/home_controller");
const passport = require("passport");

const router = express.Router();

router.get(
  "/",
  passport.checkAuthentication,
  passport.checkUserAuthentication,
  homeController.home
);
router.get(
  "/profile",
  passport.checkAuthentication,
  passport.checkUserAuthentication,
  homeController.home_profile
);

router.get(
  "/super_admin",
  passport.checkSuperAdminAuthentication,
  homeController.superAdmin
);
router.get(
  "/super_admin/adminRequests",
  passport.checkSuperAdminAuthentication,
  homeController.superAdminDepartment
);
router.get(
  "/super_admin/updateAccess",
  passport.checkSuperAdminAuthentication,
  homeController.updateAccess
);
router.get(
  "/super_admin/updateadmin",
  passport.checkSuperAdminAuthentication,
  homeController.updateAdmin
);
router.get(
  "/super_admin/updatestudent",
  passport.checkSuperAdminAuthentication,
  homeController.updateStudent
);
router.get(
  "/super_admin/updateprofessor",
  passport.checkSuperAdminAuthentication,
  homeController.updateProfessor
);
router.get(
  "/superSendMessage/:dues",
  passport.checkSuperAdminAuthentication,
  homeController.superSendMessage
);
router.get(
  "/superApproveDues/:dues",
  passport.checkSuperAdminAuthentication,
  homeController.superApproveDues
);
router.get(
  "/superApproveManyDues/:dues",
  passport.checkSuperAdminAuthentication,
  homeController.superApproveManyDues
);



router.get(
  "/admin_home",
  passport.checkAdminAuthentication,
  homeController.adminHome
);
router.get(
  "/sendMessage/:dues",
  passport.checkAdminAuthentication,
  homeController.sendMessage
);
router.get(
  "/approveDues/:dues",
  passport.checkAdminAuthentication,
  homeController.approveDues
);
router.get(
  "/approveManyDues/:dues",
  passport.checkAdminAuthentication,
  homeController.approveManyDues
);
router.get(
  "/sheet",
  passport.checkAdminAuthentication,
  passport.checkSheetAuthentication,
  homeController.sheet
);

router.get(
  "/showSheet",
  passport.checkAdminAuthentication,
  passport.checkSheetAuthentication,
  homeController.showSheet
);

router.get(
  "/proff_home",
  passport.checkProffAuthentication,
  homeController.proffHome
);

router.get(
  "/sendMessageBtp/:dues",
  passport.checkProffAuthentication,
  homeController.sendMessageBtp
);
router.get(
  "/sendMessageIp/:dues",
  passport.checkProffAuthentication,
  homeController.sendMessageIp
);
router.get(
  "/ipApproved/:dues",
  passport.checkProffAuthentication,
  homeController.ipApproved
);
router.get(
  "/btpApproved/:dues",
  passport.checkProffAuthentication,
  homeController.btpApproved
);
router.get(
  "/approveEmailProf/:dues",
  passport.checkProffAuthentication,
  homeController.approveEmailProf
);

router.get(
  `/ipApprovedMail/:profEmail/:studentId/:idx`,
  homeController.ipApprovedThroughMail
);
router.get(
  `/btpApprovedMail/:profEmail/:studentId/:idx`,
  homeController.btpApprovedThroughMail
);
router.get(`/ip/btp/:status`, homeController.afterMailPage);

router.get(
  "/sendBtpRequest/:obj",
  passport.checkUserAuthentication,
  homeController.sendBtpRequest
);
router.get(
  "/sendIpRequest/:obj",
  passport.checkUserAuthentication,
  homeController.sendIpRequest
);
router.post(
  "/sendBankDetails",
  passport.checkAuthentication,
  (req, res, next) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      req.body = JSON.parse(data);
      next();
    });
  },
  homeController.sendBankDetails
);
router.post(
  "/sendPersonalDetails",
  passport.checkAuthentication,
  (req, res, next) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      req.body = JSON.parse(data);
      next();
    });
  },
  homeController.sendPersonalDetails
);
router.post(
  "/sendDonationDetails",
  passport.checkAuthentication,
  (req, res, next) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      req.body = JSON.parse(data);
      next();
    });
  },
  homeController.sendDonationDetails
);

router.get("/download/:id", homeController.download);

router.get(
  "/bankAccountDetails",
  passport.checkBankAuthentication,
  homeController.bankAccountDetails
);
router.get(
  "/sendPersonalDetails",
  passport.checkBankAuthentication,
  homeController.sendPersonalDetails
);

router.get(
  "/request/:obj",
  passport.checkAuthentication,
  homeController.request
);

router.get(
  "/getFunction",
  passport.checkAuthentication,
  homeController.getFunction
);

router.use("/user", require("./user"));

router.all("*", function (req, res) {
  req.flash("error", "Please Try Again or Later!");
  res.redirect("/");
});

module.exports = router;
