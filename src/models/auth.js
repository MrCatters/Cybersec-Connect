`use strict`

const { Schema, mongoose } = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = new Schema ({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        maxlengh: 64
    },
})


userSchema.pre('save', function(next) {

    let user = this;
    
    bcrypt.hash(user.password, '$2b$12$hMCGib9sCs8aH/V6/lG.Ue')
    .then(hash => {
        user.password = hash;
        next();
    })
    .catch(err => next(err));
});

userSchema.methods.comparePassword = function(providedUser) {
    let foundUser = this;
    return bcrypt.compare(providedUser.password, foundUser.password);
}

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;