var express = require("express");
var router = express.Router();
var jwt = require("express-jwt");
var auth = require("../config/authExample");

var ctrlPlan = require("../controllers/plan");
var ctrlProfile = require("../controllers/profile");
var ctrlAuth = require("../controllers/authentication");

// Profilo Studente, Docente o Admin
router.get("/profile", auth, ctrlProfile.verify);
router.get("/facultiesInfo", auth, ctrlProfile.getFaculties); //Per ottenere i dati delle iscrizioni degli studenti.

// Autenticazione e Registrazione Utente
router.post("/register", ctrlAuth.registerUser);
router.post("/login", ctrlAuth.login);

//Piano di Studi Studente
router.get("/studentPlan", auth, ctrlPlan.getStudentPlan); //Ottiene il piano di studi per uno studente

//Corsi Docente
router.get("/professorPlan/:email", auth, ctrlPlan.getProfessorCoursesInfo) //Ottiene tutte le informazioni sui corsi tenuti da un docente

//Gestione Piano di Studi Admin
router.get("/plan", auth, ctrlPlan.getAllPlan); //Restituisce tutti i piani
router.post("/plan", ctrlPlan.addCourse); //Aggiunge un corso
router.delete("/plan/:courseId", ctrlPlan.deleteCourseById); //Cancella un corso
module.exports = router;
