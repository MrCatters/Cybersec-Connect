'use strict'

const connectionModel = require('../models/connections');
const { DateTime } = require("luxon");
const {mongoose} = require("mongoose").set('debug', true);
const userModel = require("../models/auth");
const { rsvpModel } = require('../models/rsvp');
const flash = require("connect-flash");

exports.read = function(req, res, next) {
    connectionModel.find()
    .then(connections => {
        let topics = new Set();
    
        connections.forEach(connection => {
            topics.add(connection.topic);
        });
    
        res.render('../views/connections/connections', {
            topics: topics,
            connections : connections
        });
    })
    .catch((err) => {
        err = new Error("Unable to load connections");
        err.status = 404
        next(err)
    });
};

exports.connection = function(req, res, next) {
    connectionModel.findById(req.params.id)
    .then(connection => {
        userModel.findById(connection.host)
        .then(async (user) => {
            const connectionObjectId = new mongoose.Types.ObjectId(req.params.id);
            const connectionRsvps = await rsvpModel.find({connection : connectionObjectId}).exec();
            res.render('../views/connections/connection', {
                id : connection.id,
                name : connection.name,
                topic : connection.topic,
                details : connection.details, 
                date : DateTime.fromJSDate(connection.date).toFormat('yyyy-MM-dd'),
                start_time : DateTime.fromJSDate(connection.start_time).toFormat('hh:mm a'),
                end_time : DateTime.fromJSDate(connection.end_time).toFormat('hh:mm a'),
                location: connection.location,
                host : user.firstName + " " + user.lastName,
                image : connection.image,
                user_id : req.session.user,
                host_id : connection.host,
                attending : connectionRsvps
            });
        })
        .catch((err) => next(err));
    })
    .catch((err1) => {
        let err = new Error("Unable to load connection by id: " + req.params.id);
        err.status = 404
        next(err)
    });
};

exports.edit = function(req, res, next) {
    connectionModel.findById(req.params.id)
    .then(connection => {
        res.render('../views/connections/editConnection', {
            id : connection.id,
            name : connection.name,
            topic : connection.topic,
            details : connection.details,
            date : DateTime.fromJSDate(connection.date).toFormat('yyyy-MM-dd'),
            start_time : DateTime.fromJSDate(connection.start_time).toLocaleString(DateTime.TIME_24_SIMPLE),
            end_time : DateTime.fromJSDate(connection.end_time).toLocaleString(DateTime.TIME_24_SIMPLE),
            location: connection.location,
            host : res.locals.userName,
            image : connection.image
        })
    }).catch((err) => {
        next(err);
    })
};

exports.create = function(req, res, next) {
    let attributes = req.body;
    return connectionModel.create({
        name : attributes.name,
        topic : attributes.topic,
        details : attributes.details,
        date : DateTime.fromFormat(attributes.date, 'yyyy-MM-dd'),
        start_time : DateTime.fromFormat(attributes.start_time, 'h:mm'),
        end_time : DateTime.fromFormat(attributes.end_time, 'h:mm'),
        location: attributes.location,
        host : res.locals.user,
        image : attributes.image
    })
    .then(() => {
        req.flash('success', 'Successfully created connection');
        res.redirect('/connections/');
    })
    .catch((err) => {
        console.log(err);
        if (Object.getPrototypeOf(err).name == "ValidationError"){
            err['message'] = "Provided attributes have failed validation. Please ensure proper formatting and length."
            err.status = 404
            next(err)
        }
        err.status = 400
        next(err);
    });
}

exports.update = function(req, res, next) {
    let newAttributes = req.body;
    let id = new mongoose.Types.ObjectId(req.params.id);
    connectionModel.updateOne(
        {_id: id},
        {$set:{
            name : newAttributes.name,
            topic : newAttributes.topic,
            details : newAttributes.details,
            date : DateTime.fromFormat(newAttributes.date, 'yyyy-MM-dd'),
            start_time : DateTime.fromFormat(newAttributes.start_time, 'h:mm'),
            end_time : DateTime.fromFormat(newAttributes.end_time, 'h:mm'),
            location: newAttributes.location,
            image : newAttributes.image
        }}
    )
    .then(() => {
        req.flash('success', 'Successfully updated connection');
        res.redirect('/connections/connection/' + req.params.id);
    })
    .catch((err) => {
        if (err.errors['name'] instanceof mongoose.Error.ValidatorError){
            err['message'] = "Provided attributes have failed validation. Please ensure proper formatting and length."
            err.status = 404
            next(err)
        }
        err.status = 400
        next(err);
    });
}

exports.delete = async function(req, res, next) {
    let id = new mongoose.Types.ObjectId(req.params.id);
    connectionModel.deleteOne({_id: id})
    .then(() => {
        rsvpModel.deleteMany({connection : id})
        .then(() => {
            res.redirect('../views/connections/');
        })
    });
};

exports.newConnection = function(req, res, next) {
    res.render('../views/connections/newConnection');
};
