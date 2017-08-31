var mongoose = require("mongoose");
var Course = mongoose.model("Course");
var User = mongoose.model("User");

//Per aggiungere un corso al database
module.exports.addCourse = function(req, res) {
  var course = new Course();

  course.faculty = req.body.faculty;
  course.subject = req.body.subject;
  course.year = req.body.year;
  course.semester = req.body.semester;
  course.cfu = req.body.cfu;
  course.entryYear = req.body.entryYear;
  course.professorEmail = req.body.professorEmail;
  course.mandatory = req.body.mandatory;

  course.save(function(err) {
    res.status(200);
    console.log("Course successfully saved to db.");
  });
};

//Cancella un corso selezionandolo tramite id
module.exports.deleteCourseById = function(req, res) {
  Course.remove(
    {
      _id: req.params.courseId
    },
    function(err, course) {
      if (err) res.send(err);
      res.json({ message: "Course successfully deleted" });
    }
  );
};

//Per ottenere tutti i corsi di tutte le facoltà e il nome del docente che tiene il corso.
module.exports.getAllPlanInfo = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      message: "UnauthorizedError: private profile"
    });
  } else {
    Course.aggregate(
      [
        {
          $lookup: {
            from: "users",
            localField: "professorEmail",
            foreignField: "email",
            as: "professor_info"
          }
        },
        {
          $unwind: "$professor_info"
        },
        {
          $project: {
            _id: 1,
            faculty: 1,
            subject: 1,
            year: 1,
            semester: 1,
            cfu: 1,
            professorEmail: 1,
            entryYear: 1,
            mandatory: 1,
            name: "$professor_info.name"
          }
        },
        {
          $sort: {
            year: 1,
            semester: 1
          }
        }
      ],
      function(err, data) {
        res.send(data);
      }
    );
  }
};
//Per ottenere il piano completo per uno studente per una precisa facoltà ed anno accademico.
module.exports.getStudentPlan = function(req, res) {
  console.log(req.payload.faculty);
  console.log(req.payload.entryYear);
  if (!req.payload._id) {
    res.status(401).json({
      message: "UnauthorizedError: private profile"
    });
  } else {
    Course.aggregate(
      [
        {
          $lookup: {
            from: "users",
            localField: "professorEmail",
            foreignField: "email",
            as: "plan_info"
          }
        },

        {
          $unwind: "$plan_info"
        },

        {
          $match: {
            $and: [
              {
                faculty: req.payload.faculty,
                entryYear: req.payload.entryYear
              }
            ]
          }
        },

        {
          $project: {
            faculty: 1,
            subject: 1,
            year: 1,
            semester: 1,
            cfu: 1,
            professorEmail: 1,
            mandatory: 1,
            name: "$plan_info.name"
          }
        },
        {
          $sort: { year: 1, semester: 1 }
        }
      ],
      function(err, data) {
        res.send(data);
      }
    );
  }
};

//Per ottenere tutte le iformazioni sui corsi di responsabilità di un docente.
module.exports.getProfessorCoursesInfo = function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      message: "UnauthorizedError: private profile"
    });
  } else {
    Course.aggregate(
      [
        {
          $lookup: {
            from: "users",
            localField: "professorEmail",
            foreignField: "email",
            as: "courses_info"
          }
        },

        {
          $unwind: "$courses_info"
        },

        {
          $match: {
            $and: [{ professorEmail: req.params.email }]
          }
        },
        {
          $project: {
            subject: 1,
            semester: 1,
            cfu: 1,
            entryYear: 1,
            faculty: 1
          }
        },
        {
          $group: {
            _id: {
              subject: "$subject",
              entryYear: "$entryYear"
            },
            cfu: { $first: "$cfu" },
            semester: { $first: "$semester" },
            faculties: { $push: "$faculty" }
          }
        },
        {
          $sort: { subject: 1 }
        }
      ],
      function(err, data) {
        console.log(data);
        res.send(data);
      }
    );
  }
};
