var mongoose = require("mongoose");
//PRENOTAZIONI
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var bookingSchema = new mongoose.Schema({
  studentMat: {
    type: String,
    required: true
  },
  examSession_id: {
    type: ObjectId,
    required: true
  }
});
const Booking = (module.exports = mongoose.model("Booking", bookingSchema));
