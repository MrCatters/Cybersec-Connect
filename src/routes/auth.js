`use strict`

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddle = require("../middleware/auth.js");
const validator = require("../middleware/validator.js");

router.get('/signup', authMiddle.isGuest, authController.signupPage);

router.get('/login', authMiddle.isGuest, authController.loginPage);

router.post('/signup', authMiddle.isGuest, validator.validateSignUp, validator.validateResult, authController.signup);

router.post('/login', authMiddle.isGuest, validator.validateSignIn, validator.validateResult, authController.login);

router.get('/profile', authMiddle.isAuth, authController.profilePage);

router.get('/signout', authMiddle.isAuth, authController.signout);


exports.router = router;