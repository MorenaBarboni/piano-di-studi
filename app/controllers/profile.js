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

//Ottiene tutti i docenti.
module.exports.getProfessors = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      message: "UnauthorizedError: private profile"
    });
  } else {
    User.find({ usertype: "docente" }, function(err, data) {
      res.send(data);
    }).sort({ name: 1 });
  }
};

//Ottiene docenti per nome.
module.exports.getProfessorByName = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      message: "UnauthorizedError: private profile"
    });
  } else {
    User.find({ usertype: "docente", name:req.params.name }, function(err, data) {
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

//Per ottenere le mail degli amministratori.
module.exports.getAdminEmails = function(req, res) {
  User.find({ usertype: "admin" }, { email: 1 }, function(err, data) {
    console.log(data);
    res.send(data);
  }).sort({ email: 1 });
};

//Per ottenere i dati delle iscrizioni degli studenti.
module.exports.getFaculties = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      message: "UnauthorizedError: private profile"
    });
  } else {
    User.find({ usertype: "studente" }, { faculty: 1, entryYear: 1 }, function(
      err,
      data
    ) {
      res.send(data);
    });
  }
};

//Controlla l'esistenza di un'email docente.
module.exports.checkEmail = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      message: "UnauthorizedError: private profile"
    });
  } else {
    User.findOne(
      { email: req.params.professorEmail, usertype: "docente" },
      function(err, data) {
        if (data) {
          res.send("ok");
        } else {
          res.send("error");
        }
      }
    );
  }
};

//Ottiene l'elenco degli studenti che si sono prenotati ad un appello
module.exports.getStudentsBySession = function(req, res) {
  var paramId = mongoose.Types.ObjectId(req.params.sessionId);

  User.aggregate(
    [
      {
        $lookup: {
          from: "bookings",
          localField: "mat",
          foreignField: "studentMat",
          as: "user_bookings"
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
      res.send(data);
    }
  );
};
