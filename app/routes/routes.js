var express = require("express");
var router = express.Router();
var jwt = require("express-jwt");
var auth = require("../config/authExample");

var ctrlProfile = require("../controllers/profile");
var ctrlAuth = require("../controllers/authentication");

// Profilo Studente, Docente o Admin
router.get("/profile", auth, ctrlProfile.verify);

// Autenticazione e Registrazione Utente
router.post("/register", ctrlAuth.registerUser);
router.post("/login", ctrlAuth.login);

module.exports = router;
