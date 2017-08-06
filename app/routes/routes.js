var express = require("express");
var router = express.Router();
var jwt = require("express-jwt");
var auth = require("../config/authExample");

var ctrlPlan = require("../controllers/plan");
var ctrlProfile = require("../controllers/profile");
var ctrlAuth = require("../controllers/authentication");

// Profilo Studente, Docente o Admin
router.get("/profile", auth, ctrlProfile.verify);

// Autenticazione e Registrazione Utente
router.post("/register", ctrlAuth.registerUser);
router.post("/login", ctrlAuth.login);

//Gestione Piano di Studi Admin
router.get("/plan", auth, ctrlPlan.getAllPlan); //Restituisce tutti i piani
router.post("/plan", ctrlPlan.addCourse); //Aggiunge un corso
router.delete("/plan/:courseId", ctrlPlan.deleteCourseById); //Cancella un corso
module.exports = router;
