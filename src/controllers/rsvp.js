`use strict`

const mongoose = require("mongoose");
const flash = require("connect-flash");
const { rsvpModel } = require("../models/rsvp");

exports.yes = function(req, res, next) {
    create(req, res, "Yes", next);
}

exports.no = function(req, res, next) {
    create(req, res, "No", next);

}

exports.maybe = function(req, res, next) {
    create(req, res, "Maybe", next);
}

// Checks for existing and returns an update or create function
function create(req, res, status, next) {
    if (req.existingRsvp) {
        req.existingRsvp.going = status;
        req.existingRsvp.save()
        .then(() => {
            req.flash('success', "Successfully updated an RSVP for this connection!");
            res.status(200);
            res.send();
        })
        .catch((err) => next(err));
    } else {
        rsvpModel.create({
            connection : req.connectionId,
            user : req.userId,
            going : status
        })
        .then(() => {
            req.flash('success', "Successfully created an RSVP for this connection!");
            res.status(200);
            res.send();
        })
        .catch((err) => next(err));
    }
}