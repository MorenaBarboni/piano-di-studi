var mongoose = require("mongoose");
var Booking = mongoose.model("Booking");
var User = mongoose.model("User");
var ExamSession = mongoose.model("ExamSession");

//Carica una nuova prenotazione
module.exports.addBooking = function(req, res) {
  var booking = new Booking();

  booking.studentMat = req.body.mat;
  booking.examSession_id = req.body.examSession_id;
  booking.mark = "";
   booking.save(function(err) {
    res.status(200);
    console.log("Booking successfully saved to db.");
  });
};

//Ottiene i dati delle prenotazioni per uno studente
module.exports.getBookings = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      message: "UnauthorizedError: private profile"
    });
  } else {
    Booking.find({ studentMat: req.params.mat }, function(err, data) {
      console.log(data);
      res.send(data);
    });
  }
};

//Ottieni tutti gli appelli per cui uno studente si è prenotato
module.exports.getSessionsByMat = function(req, res) {
  Booking.aggregate(
    [
      {
        $lookup: {
          from: "examsessions",
          localField: "examSession_id",
          foreignField: "_id",
          as: "session_booking"
        }
      },
      {
        $unwind: "$session_booking"
      },
      {
        $match: {
          $and: [{ studentMat: req.params.mat }]
        }
      },
      {
        $project: {
          subject: "$session_booking.subject",
          room: "$session_booking.room",
          date: "$session_booking.date",
          time: "$session_booking.time",
          faculty: "$session_booking.faculty",
          examType: "$session_booking.examType",
          examSession_id: 1
        }
      }
    ],
    function(err, data) {
      res.send(data);
    }
  );
};

//Cancella una prenotazione
module.exports.deleteBookingById = function(req, res) {
  Booking.remove(
    {
      _id: req.params.bookingId
    },
    function(err) {
      if (err) res.send(err);
      res.json({ message: "Booking successfully deleted" });
    }
  );
};

//Rimuove le prenotazioni all'eliminazione del relativo appello
module.exports.deleteBookingBySessionId = function(req, res) {
  Booking.remove(
    {
      examSession_id: req.params.sessionId
    },
    function(err) {
      if (err) res.send(err);
      res.json({ message: "Bookings of Session successfully deleted" });
    }
  );
};
