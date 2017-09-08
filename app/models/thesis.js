var mongoose = require("mongoose");

var thesisSchema = new mongoose.Schema({
  studentEmail: {
    type: String,
    required: true
  },
 professorEmail: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  approved: {
    type: Boolean,
    required:true
  }
});
const Thesis = (module.exports = mongoose.model(
  "Thesis",  thesisSchema
));
