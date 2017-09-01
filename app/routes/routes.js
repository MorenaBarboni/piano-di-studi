var express = require("express");
var router = express.Router();
var jwt = require("express-jwt");
var auth = require("../config/authExample");

var ctrlPlan = require("../controllers/plan");
var ctrlProfile = require("../controllers/profile");
var ctrlAuth = require("../controllers/authentication");
var ctrlExam = require("../controllers/exam");

// Profilo Studente, Docente o Admin
router.get("/profile", auth, ctrlProfile.verify);
router.get("/facultiesInfo", auth, ctrlProfile.getFaculties); //Per ottenere i dati delle iscrizioni degli studenti.

// Autenticazione e Registrazione Utente
router.post("/register", ctrlAuth.registerUser); //registrazione utente
router.post("/login", ctrlAuth.login); //login utente

//Piano di Studi Studente
router.get("/studentPlan", auth, ctrlPlan.getStudentPlan); //Ottiene il piano di studi per uno studente

//Carriera studente
router.get("/career", auth, ctrlExam.getExamsByStudent); //Ottiene gli esami superati da uno studente

//Corsi Docente
router.get("/professorPlan/:email", auth, ctrlPlan.getProfessorCoursesInfo); //Ottiene tutte le informazioni sui corsi tenuti da un docente

//Gestione Piano di Studi Admin
router.get("/plan", auth, ctrlPlan.getAllPlanInfo); //Restituisce tutti i piani di studio
router.post("/plan", ctrlPlan.addCourse); //Aggiunge un corso
router.delete("/plan/:courseId", ctrlPlan.deleteCourseById); //Cancella un corso

//Gestione utenti Admin
router.get("/users", auth, ctrlProfile.getAllUsers); //Ottiene tutti gli utenti
router.delete("/profile/:_id", ctrlProfile.deleteUserById); //Elimina un utente tramite Id

module.exports = router;
