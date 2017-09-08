var mongoose = require("mongoose");
var Thesis = mongoose.model("Thesis");

//Consente di aggiungere una richiesta di tesi
module.exports.addRequest = function(req, res) {
  var thesis = new Thesis();

  thesis.studentEmail = req.body.studentEmail;
  thesis.professorEmail = req.body.professorEmail;
  thesis.notes = req.body.notes;
  thesis.title = req.body.title;
  thesis.approved = false;

  Thesis.findOne({ studentEmail: thesis.studentEmail }, function(
    err,
    data
  ) {
    if (data) {
      res.send(true);
    } else {
      thesis.save(function(err) {
        res.send(false);
      });
    }
  });
};

//Per ottenere tutte le richieste di tesi inviate da uno studente.
module.exports.getRequestedThesis = function(req, res) {
  Thesis.find(
    { studentEmail: req.params.email, approved: false },
    function(err, data) {
      res.send(data);
      console.log(data);
    }
  ).sort({ professorEmail: 1 });
};

//Per ottenere tutte le richieste di tesi per un docente.
module.exports.getThesisRequests = function(req, res) {
  Thesis.aggregate(
    [
      {
        $lookup: {
          from: "users",
          localField: "studentEmail",
          foreignField: "email",
          as: "students_thesis"
        }
      },
      {
        $unwind: "$students_thesis"
      },
      {
        $match: {
          professorEmail: req.params.email
        }
      },
      {
        $project: {
          studentEmail: 1,
          approved: 1,
          title: 1,
          notes: 1,
          name: "$students_thesis.name",
          mat: "$students_thesis.mat",
          faculty: "$students_thesis.faculty"
        }
      }
    ],
    function(err, data) {
      res.send(data);
    }
  );
};

//Per ottenere la tesi accettata.
module.exports.getApprovedThesis = function(req, res) {
  Thesis.aggregate(
    [
      {
        $lookup: {
          from: "users",
          localField: "professorEmail",
          foreignField: "email",
          as: "plan_thesis"
        }
      },
      {
        $unwind: "$plan_thesis"
      },
      {
        $match: {
          studentEmail: req.params.email,
          approved: true
        }
      },
      {
        $project: {
          professorEmail: 1,
          approved: 1,
          title: 1,
          notes:1,
          name: "$plan_thesis.name"
        }
      }
    ],
    function(err, data) {
      res.send(data);
    }
  );
};

//Accetta una richiesta tesi
module.exports.approveRequest = function(req, res) {
  Thesis.update(
    { _id: req.params.requestId },
    {
      $set: {
        approved: true
      }
    },
    function(err) {
      if (err) {
        console.log(err);
      }
      res.status(200);
    }
  );
};

//Elimina una richiesta di tesi inviata ad un docente
module.exports.deleteRequest = function(req, res) {
 Thesis.remove(
    {
      _id: req.params.requestId
    },
    function(err) {
      if (err) res.send(err);
      res.json({ message: "Thesis request successfully deleted" });
    }
  );
};

