'use strict'

const express = require("express");
const app = express();
const mainRoutes = require('./routes/main');
const connectionRoutes = require('./routes/connections');
const authRoutes = require('./routes/auth')
const userModel = require('./models/auth');
const rsvpRoutes = require('./routes/rsvp');
const override = require('method-override');
const { default: mongoose } = require("mongoose");
const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

let host = "127.0.0.1";
let port = 3000;
let uri = "mongodb://127.0.0.1:27090/NBAD"

app.use(express.static(__dirname + "\\public"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(override("_method"));
app.use(session({
  secret: 'AAAAB3NzaC1yc2EAAAADAQABAAABAQCkLiLtGdCbnGpJx5JEJR1MVGFI7PwjTn3KAFu47YCLM4ej1vVqvDAY4uzeO07x1XubqdbMA+GAeTWwpMouRT2zktVNqHlozmxZz8DvPR',
  cookie: {maxAge: 86400000},
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: uri })
}));
app.use(flash());


app.use(async (req, res, next) => {
  // res.locals sets intermediate data for the view
  res.locals.user = req.session.user||null;
  var user = await userModel
    .findById(new mongoose.Types.ObjectId(req.session.user))
    .exec()
  if (user !== null) {
    res.locals.userName = user.firstName;
  }
  res.locals.errorMessages = req.flash('error');
  res.locals.successMessages = req.flash('success');
  next();
});

console.log("Connecting to Mongoose DB at:", uri);

mongoose.connect(uri)
.then(() => {
  app.listen(port, host, () => {
    console.log("The server is listening on ", host, port);
  });
})
.catch(err => console.log(err));

app.use('/', mainRoutes.router);
app.use('/connections', connectionRoutes.router);
app.use('/auth', authRoutes.router);
app.use('/rsvp', rsvpRoutes.router);


// If it gets here none of the routes could be handled.
app.use((req, res, next) => {
  let err = new Error('The server cannot locate ' + req.url);
  err.status = 404;
  // Propagates to the error handler.
  next(err);
});

app.use((err, req, res, next) => {
  if (!err.status) {
    console.log(err);
    err.status = 404;
    err.message = ("Internal server error");
  }

  res.status(err.status);
  res.render('error.ejs', {err : err});
});

