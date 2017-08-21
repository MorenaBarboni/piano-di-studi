var mongoose = require('mongoose');

var courseSchema = new mongoose.Schema({
    faculty: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    cfu: {
        type: Number,
        required: true
    }
});

const Course = module.exports = mongoose.model('Course', courseSchema);


