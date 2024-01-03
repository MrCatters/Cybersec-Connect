`use strict`

const {rsvpModel} = require("../models/rsvp");
const { mongoose } = require("mongoose");

async function checkExisting(req, res, next) {
    req.existingRsvp = await rsvpModel.findOne({
        connection : req.connectionId,
        user : req.userId
    }).exec();
    next();
}

function getUserAndConnection(req, res, next) {
    req.userId = new mongoose.Types.ObjectId(res.locals.user);
    req.connectionId = new mongoose.Types.ObjectId(req.body.connectionId);
    next();
}

module.exports = {checkExisting, getUserAndConnection};