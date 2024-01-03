'use strict'

const express = require('express');
const router = express.Router();
const authMiddle = require("../middleware/auth.js");
const rsvp = require("../controllers/rsvp.js");
const rsvpMiddle = require("../middleware/rsvp.js");
const validator = require("../middleware/validator.js");

router.post('/yes',
    rsvpMiddle.getUserAndConnection, 
    authMiddle.isAuth, 
    rsvpMiddle.checkExisting, 
    validator.validateId,
    validator.validateResult,
    rsvp.yes);

router.post('/no',
    rsvpMiddle.getUserAndConnection,
    authMiddle.isAuth,
    rsvpMiddle.checkExisting,
    validator.validateId,
    validator.validateResult,

    rsvp.no);

router.post('/maybe',
    rsvpMiddle.getUserAndConnection,
    authMiddle.isAuth,
    rsvpMiddle.checkExisting,
    validator.validateId,
    validator.validateResult,
    rsvp.maybe);

exports.router = router;
