var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongodb = require("mongodb");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost/testDB'


//Require Passport
var passport = require('passport');

//Require Database
require('./app/config/db');

//Passport configuration
require('./app/config/passport');

// API routes
var routesApi = require('./app/routes/routes');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Passport 
app.use(passport.initialize());

// API routes used when path starts with /api
app.use('/api', routesApi);

app.use(function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

var db;

// Connect to the database
mongodb.MongoClient.connect(mongoUri, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// Errors

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

module.exports = app;
