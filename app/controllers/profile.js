var mongoose = require("mongoose");
var User = mongoose.model("User");

//Per verificare l'accesso
module.exports.verify = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      message: "You're not authorized to access this page"
    });
  } else {
    User.findById(req.payload._id).exec(function(err, user) {
      res.status(200).json(user);
    });
  }
};

//Ottiene tutti gli utenti.
module.exports.getAllUsers = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      message: "UnauthorizedError: private profile"
    });
  } else {
    User.find({}, function(err, data) {
        res.send(data);
    }).sort({ name: 1 });
  }
};

//Cancella un utente selezionandolo tramite id
module.exports.deleteUserById = function(req, res) {
  User.remove(
    {
      _id: req.params._id
    },
    function(err, course) {
      if (err) res.send(err);
      res.json({ message: "User successfully deleted" });
    }
  );
};

//Per ottenere i dati delle iscrizioni degli studenti.
module.exports.getFaculties = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      message: "UnauthorizedError: private profile"
    });
  } else {
    User.find({ usertype: "studente" }, { faculty: 1, entryYear: 1 }, function(err, data ) {
      res.send(data);
    });
  }
};

//Ottiene l'elenco degli studenti che si sono prenotati ad un appello
module.exports.getStudentsBySession = function(req, res) {
  var paramId = mongoose.Types.ObjectId(req.params.sessionId);

  User.aggregate(
    [
      {
        $lookup: {
          from: "bookings", // other table name
          localField: "mat", // name of users table field
          foreignField: "studentMat", // name of userinfo table field
          as: "user_bookings" // alias for userinfo table
        }
      },
      {
        $unwind: "$user_bookings"
      },
      {
        $project: {
          mat: 1,
          name: 1,
          email: 1,
          examSession_id: "$user_bookings.examSession_id"
        }
      },
      {
        $match: {
          $and: [{ examSession_id: paramId }]
        }
      }
    ],
    function(err, data) {
      console.log(data);
      res.send(data);
    }
  );
};
