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

//Per ottenere i dati delle iscrizioni degli studenti.
module.exports.getFaculties = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      message: "UnauthorizedError: private profile"
    });
  } else {
    User.find({ usertype: "studente" }, {faculty:1, entryYear:1}, function(err, data) {
      console.log(data);
      res.send(data);
    });
  }
};
