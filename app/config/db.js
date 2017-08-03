var mongoose = require('mongoose');
var url = 'mongodb://localhost/pianoDiStudi';

//Models

require('../models/users');

mongoose.connect(url);


mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + url);
});
mongoose.connection.on('error', function (err) {
  console.log('Mongoose error: ' + err);
});



