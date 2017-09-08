var mongoose = require('mongoose');
var url = 'mongodb://localhost/pianoDiStudi';

//Models

require('../models/users'); //Utenti
require('../models/courses'); //Corsi
require('../models/exams'); //Esami Registrati
require('../models/examSessions'); //Appelli
require('../models/bookings'); //Prenotazioni
require('../models/thesis'); //Richieste Tesi

mongoose.connect(url);


mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + url);
});
mongoose.connection.on('error', function (err) {
  console.log('Mongoose error: ' + err);
});



