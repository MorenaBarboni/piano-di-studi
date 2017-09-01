var mongoose = require("mongoose");

var examSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  mat: {
    type: String,
    required: true
  },
  examDate: {
    type: String,
    required: true
  },
  mark: {
    type: Number,
    required: true
  }
});

const Exam = (module.exports = mongoose.model("Exam", examSchema));
