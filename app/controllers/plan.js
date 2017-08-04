var mongoose = require('mongoose');
var Course = mongoose.model('Course');
var User = mongoose.model('User');


//Per aggiungere un corso al database
module.exports.addCourse = function (req, res) {

    var course = new Course();

    course.degree = req.body.degree;
    course.subject = req.body.subject;
    course.year = req.body.year;
    course.semester = req.body.semester;
    course.cfu = req.body.cfu;

    course.save(function (err) {
        res.status(200);
        console.log('Course successfully saved to db.');
    })
};

//Per ottenere tutti i corsi di tutte le facoltà.
module.exports.getAllPlan = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    } else {
        Course.find({}, function (err, data) {
            res.send(data);
        }).sort({ year: 1, semester: 1 });
    }

};

