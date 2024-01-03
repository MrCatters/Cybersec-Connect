'use strict'
const { Schema, mongoose } = require("mongoose");
const { ObjectId } = require("mongodb");
const { DateTime } = require("luxon");

const connectionSchema = new Schema({
    host: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        trim: true
    },
    name: {
        type: String,
        minLength: 2,
        required: true,
        trim: true
    },
    topic: {
        type: String,
        minLength: 2,
        required: true,
        trim: true
    },
    details: {
        type: String,
        minLength: 10,
        required: true,
        trim: true
    },
    location: {
        type: String,
        minLength: 5,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true,
        trim: true
    },
    start_time: {
        type: Date,
        required: true,
        trim: true
    },
    end_time: {
        type: Date,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
})

const connectionModel = mongoose.model('NBAD', connectionSchema);
module.exports = connectionModel;
