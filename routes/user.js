const express = require('express');
const userController = require('../controllers/user_controller');
const passport = require('passport');

const router = express.Router();

router.get('/profile', passport.checkAuthentication, userController.profile);
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

module.exports = router;