const express = require('express');
const userController = require('../controllers/user_controller');
const passport = require('passport');

const router = express.Router();

// router.get('/profile', passport.checkAuthentication, userController.profile);
router.get('/signup', userController.signup);
router.get('/signin', userController.signin);
router.post('/create', userController.create);
router.post('/createSession', passport.authenticate(
    'local',
    {failureRedirect: '/user/signin'}
), userController.createSession);
router.get('/signout', userController.destroySession);
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect:'/user/signin'}), userController.createSession);
router.get('/getProfessors', userController.getProfessors);
router.get('/getStudents', userController.getStudents);
router.get('/getAdmins', userController.getAdmins);
router.get('/getUser/:id', userController.getUser);
router.get('/getStudentsLoggedIn', userController.getStudentsLoggedIn);

router.all('*', function(req, res) {
    res.status(404).send("Sorry! Couldn't find this URL");
});




module.exports = router;    