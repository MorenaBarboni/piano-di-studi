var mongoose = require("mongoose");

// APPELLI
var examSessionSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  faculty: {
    type: String
  },
  entryYear: {
    type: String,
    required: true
  },
  examType: {
    type: String,
    required: true
  },
  professorEmail: {
    type: String,
    required: true
  }
});
const ExamSession = (module.exports = mongoose.model(
  "ExamSession",
  examSessionSchema
));
