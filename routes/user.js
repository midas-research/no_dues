const express = require("express");
const userController = require("../controllers/user_controller");
const passport = require("passport");

const router = express.Router();

// router.get('/profile', passport.checkAuthentication, userController.profile);
router.get("/signup", userController.signup);
router.get("/signin", userController.signin);
router.post("/create", userController.create);
router.post(
  "/createSession",
  passport.authenticate("local", { failureRedirect: "/user/signin" }),
  userController.createSession
);
router.get("/signout", userController.destroySession);
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/user/failedSignIn" }),
  userController.createSession
);
router.get(
  "/getProfessors",
  passport.checkAuthentication,
  userController.getProfessors
);
router.get("/failedSignIn", userController.failedSignIn);
router.get("/getProfessorName/:profEmail", userController.getProfessorName);
router.get(
  "/getStudents/:status",
  passport.checkAuthentication,
  userController.getStudents
);

router.get(
  "/getStudents/:adminName/:status",
  passport.checkAuthentication,
  userController.getStudentsAdmin
);

router.get(
  "/getStudents/professor/:profEmail/:status",
  passport.checkAuthentication,
  userController.getStudentsProfessor
);

router.get("/getAdmins", userController.getAdmins);
router.get("/getAdmin/:admin", userController.getAdminDetails);
router.get(
  "/getUser/:id",
  passport.checkAuthentication,
  userController.getUser
);
router.get(
  "/getStudentsLoggedIn",
  passport.checkAuthentication,
  userController.getStudentsLoggedIn
);

router.all("*", function (req, res) {
  res.status(404).send("Sorry! Couldn't find this URL");
});

module.exports = router;
