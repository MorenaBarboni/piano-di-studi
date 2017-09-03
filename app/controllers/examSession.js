var mongoose = require("mongoose");
var Course = mongoose.model("Course");
var ExamSession = mongoose.model("ExamSession");
var Exam = mongoose.model("Exam");

//Carica un nuovo appello
module.exports.addExamSession = function(req, res) {
  var examSession = new ExamSession();
  console.log(req.body.professorEmail);

  examSession.faculty = req.body.faculty;
  examSession.subject = req.body.subject;
  examSession.room = req.body.room;
  examSession.date = req.body.date;
  examSession.time = req.body.time;
  examSession.examType = req.body.examType;
  examSession.entryYear = req.body.entryYear;
  examSession.professorEmail = req.body.professorEmail;

  console.log(examSession);

  examSession.save(function(err) {
    res.status(200);
    console.log("exam session successfully saved to db.");
  });
};

//Cancella un appello selezionandolo tramite id
module.exports.deleteSessionById = function(req, res) {
  ExamSession.remove(
    {
      _id: req.params.sessionId
    },
    function(err) {
      if (err) res.send(err);
      res.json({ message: "exam session successfully deleted" });
    }
  );
};

//Ottieni un appello tramite id
module.exports.getSessionsById = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      message: "UnauthorizedError: private profile"
    });
  } else {
    ExamSession.find({ _id: req.params.sessionId }, function(err, data) {
      res.send(data);
    });
  }
};

//Ottiene tutti gli appelli caricati da uno specifico docente
module.exports.getSessionsByProfessor = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      message: "UnauthorizedError: private profile"
    });
  } else {
    ExamSession.find({ professorEmail: req.params.email }, function(err, data) {
      res.send(data);
    }).sort({ date: 1 });
  }
};

//Ottiene l'elenco di matricole degli studenti per i quali un determinato esame è già stato verbalizzato
module.exports.getRegisteredMat = function(req, res) {
  var paramId = mongoose.Types.ObjectId(req.params.sessionId);
  ExamSession.aggregate(
    [
      {
        $lookup: {
          from: "exams",
          localField: "subject",
          foreignField: "subject",
          as: "session_exams"
        }
      },
      {
        $unwind: "$session_exams"
      },
      {
        $match: {
          $and: [{ _id: paramId }]
        }
      },
      {
        $project: {
          mat: "$session_exams.mat",
          mark: "$session_exams.mark"
        }
      }
    ],
    function(err, data) {
      console.log(data);
      res.send(data);
    }
  );
};

//Ottiene tutti gli appelli disponibili per una facoltà e coorte
module.exports.getAvailableSessions = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      message: "UnauthorizedError: private profile"
    });
  } else {
    ExamSession.aggregate(
      [
        {
          $lookup: {
            from: "courses",
            localField: "subject",
            foreignField: "subject",
            as: "session_courses"
          }
        },
        {
          $unwind: "$session_courses"
        },
        {
          $match: {
            $and: [
              { faculty: req.params.faculty, entryYear: req.params.entryYear }
            ]
          }
        },
        {
          $project: {
            _id: 1,
            subject: 1,
            faculty: 1,
            room: 1,
            year: 1,
            date: 1,
            time: 1,
            examType: 1,
            entryYear: 1,
            professorEmail: 1,
            year: "$session_courses.year"
          }
        },
        {
          $group: {
            _id: {
              subject: "$subject",
              faculty: "$faculty",
              date: "$date"
            },
            session_id: { $first: "$_id" },
            room: { $first: "$room" },
            year: { $first: "$year" },
            time: { $first: "$time" },
            examType: { $first: "$examType" },
            professorEmail: { $first: "$professorEmail" },
            entryYear: { $first: "$entryYear" }
          }
        },
        {
          $sort: {
            subject: 1
          }
        }
      ],
      function(err, data) {
        res.send(data);
      }
    );
  }
};
