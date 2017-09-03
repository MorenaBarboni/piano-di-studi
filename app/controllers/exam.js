var mongoose = require("mongoose");
var Course = mongoose.model("Course");
var Exam = mongoose.model("Exam");

//Registra l'esito di un esame per uno studente
module.exports.addExam = function(req, res) {
  var exam = new Exam();
  exam.subject = req.body.subject;
  exam.mat = req.body.mat;
  exam.examDate = req.body.examDate;
  exam.mark = req.body.mark;

  Exam.findOne({ subject: exam.subject, mat: exam.mat }, function(err, data) {
    if (data) {
      res.send(true);
    } else {
      exam.save(function(err) {
        res.send(false);
      });
    }
  });
};

//Ottiene la lista degli esami superati da uno studente
module.exports.getExamsByStudent = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      message: "UnauthorizedError: private profile"
    });
  }
  if (req.payload.mat) {
    Exam.find({ mat: req.payload.mat }, function(err, data) {
      console.log(data);
      res.send(data);
    }).sort({ date: 1 });
  } else {
    res.status(401).json({
      message: "Error: mat not found"
    });
  }
};

//Consente allo studente di ottenere la lista dei nomi degli esami superati

module.exports.getExamsNames = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      message: "UnauthorizedError: private profile"
    });
  }
  if (req.params.mat) {
    Exam.find({ mat: req.params.mat }, { subject: 1 }, function(err, data) {
      res.send(data);
    });
  }
};
