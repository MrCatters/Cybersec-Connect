`use strict`

const mongoose = require("mongoose");
const userModel = require("../models/auth.js");
const connectionsModel = require("../models/connections.js");
const { rsvpModel } = require("../models/rsvp.js");

exports.signupPage = function(req, res, next) {
    res.render("./auth/signup", {messages: req.flash('error')});
}

exports.loginPage = function(req, res, next) {
    res.render("./auth/login");
}

exports.profilePage = function(req, res, next) {
    let id = new mongoose.Types.ObjectId(res.locals.user);

    // find the connections a user owns
    connectionsModel.find({host : id})
    .then((userConnections) => {
        // find the rsvps for a users
        rsvpModel.find({user : id})
        .then(async (rsvps) => {
            var rsvpConnections = [];
            // Executes synchronously
            for (let i = 0; i < rsvps.length; i++) {
                rsvpConnections.push(await connectionsModel.findById(rsvps[i].connection).exec());
            }
            // find the associated connection by the id
            res.render("./auth/profile", 
                {
                    rsvps : rsvps,
                    rsvpConnections : rsvpConnections,
                    userConnections : userConnections
                }
            );
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
}

exports.signup = function(req, res, next) {
    let user = new userModel(req.body);
    user.save()
    .then(saved => {
        req.session.user = user.id;
        req.flash('success', 'Successfully created account and logged in');
        res.redirect("/auth/profile");
    })
    .catch((err) => {
        if (err.code == 11000) {
            req.flash('error', 'A user with this email already exists');
            res.redirect("/auth/signup");
        } else {
            next(err);
        }
    });
}

exports.login = function(req, res, next) {
    let providedUser = req.body;

    userModel.findOne({
        email: providedUser.email.trim()
    })
    .then(foundUser => {
        if (foundUser != null) {
            foundUser.comparePassword(providedUser)
            .then(validPassword => {
                if (validPassword == true){
                    req.flash('success', 'Successfully logged in');
                    req.session.user = foundUser._id;
                    res.redirect("/auth/profile");
                    return;
                } else {
                    req.flash('error', 'Invalid user credentials');
                    res.redirect("/auth/login");
                }
            });
        } else {
            req.flash('error', 'Invalid user credentials');
            res.redirect("/auth/login");
        }
    })
    .catch(err => next(err));
}


exports.signout = function(req, res, next) {
    req.session.destroy(function(err) {
        if (err) {
            next(err);
        }
        res.redirect("/");
    })
}


