var mongoose = require("mongoose");
var Course = mongoose.model("Course");
var Exam = mongoose.model("Exam");

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
