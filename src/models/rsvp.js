`use strict`

const {Schema, mongoose, Model} = require("mongoose");

const rsvpSchema = new Schema({
    connection: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Connections',
        trim: true
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Users',
        trim: true
    },
    going: {
        type: String,
        required: true,
        trim: true
    }
})

const rsvpModel = mongoose.model("rsvps", rsvpSchema);
module.exports = {rsvpModel};