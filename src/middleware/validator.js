const {body, validationResult} = require('express-validator');
const { format } = require('morgan');


exports.validateId = (req, res, next)=>{
    let id = req.params.id;
    //an objectId is a 24-bit Hex string
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid connection id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};

exports.validateConnection = [
    body('name', 'Name cannot be empty').notEmpty().trim().escape(),
    body('topic', 'Topic cannot be empty').notEmpty().trim().escape(),
    body('date', 'Date is invalid').notEmpty().trim().escape(),
    body('start_time', 'Start time is invalid').notEmpty().trim().escape(),
    body('end_time', 'End time is invalid').notEmpty().trim().escape(),
    body('location', 'Location cannot be empty').notEmpty().trim().escape(),
    body('image', 'Image URL is invalid').isURL().trim().escape(),
    body('details', 'Details must be at least 10 characters').isLength({min: 10}).trim().escape()
];

exports.validateSignUp = [
    body('firstName', 'First name can not be empty.').notEmpty().trim().escape(),
    body('lastName', 'Last name can not be empty.').notEmpty().trim().escape(),
    body('email', 'Email must be a valid email address.').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 characters.').isLength({min: 8, max: 64})
];

exports.validateSignIn = [
    body('email', 'Email must be a valid email address.').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 characters.').isLength({min: 8, max: 64})
];

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Redirect users back to the page since we can not validate
        errors.array().forEach(err => {
            req.flash('error', err.msg);
        });
        // return stops the execution of the current function
        return res.redirect('back');
    } else {
        return next();
    }
};