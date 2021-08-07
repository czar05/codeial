const express = require('express');

const router = express.Router();

const Passport = require('passport');

const usersController = require('../controllers/users_controller');

router.get('/profile', Passport.checkAuthentication, usersController.profile);


router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);


router.post('/create', usersController.create);

//use passport as a middleware to authenticate
router.post('/create-session', Passport.authenticate(
    'local',
    {failureRedirect : '/users/sign-in'},
), usersController.createSession);

module.exports = router;//check now