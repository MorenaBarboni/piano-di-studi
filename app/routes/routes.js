var express = require("express");
var router = express.Router();
var jwt = require("express-jwt");
var auth = require("../config/authExample");

var ctrlPlan = require("../controllers/plan");
var ctrlProfile = require("../controllers/profile");
var ctrlAuth = require("../controllers/authentication");
var ctrlExam = require("../controllers/exam");
var ctrlSession = require("../controllers/examSession");
var ctrlBooking = require("../controllers/bookings");
var ctrlThesis = require("../controllers/thesis");

// Profilo Studente, Docente o Admin
router.get("/profile", auth, ctrlProfile.verify);
router.get("/facultiesInfo", auth, ctrlProfile.getFaculties); //Per ottenere i dati delle iscrizioni degli studenti.
router.get("/user/adminEmail", ctrlProfile.getAdminEmails); //Per ottenere le mail degli admin.

// Autenticazione e Registrazione Utente
router.post("/register", ctrlAuth.registerUser); //registrazione utente
router.post("/login", ctrlAuth.login); //login utente

//Piano di Studi Studente
router.get("/studentPlan", auth, ctrlPlan.getStudentPlan); //Ottiene il piano di studi per uno studente
router.get("/plan/thesis/:faculty/:entryYear", auth, ctrlPlan.getPlanThesis); //Restituisce la tesi di un piano di studi


//Carriera studente
router.get("/career", auth, ctrlExam.getExamsByStudent); //Ottiene gli esami superati da uno studente

//Ricerca docente
router.get("/user/professors", auth, ctrlProfile.getProfessors); //Ottiene tutti i docenti
router.get("/user/professorEmail/:professorEmail", auth, ctrlProfile.checkEmail); //Controlla l'esistenza dell'email
router.get("/user/professor/:name", auth, ctrlProfile.getProfessorByName); //Ottiene uno o più docenti per nome

//Prenotazione Appelli Studente
router.post("/examBooking/booking", ctrlBooking.addBooking); //Carica una prenotazione
router.delete("/examBooking/booking/:bookingId", ctrlBooking.deleteBookingById); //Cancella un corso
router.get("/examBooking/availableSessions/:faculty/:entryYear", auth, ctrlSession.getAvailableSessions); //Ottiene l'elenco degli appelli per lo studente
router.get("/examBooking/studentExams/:mat", auth, ctrlExam.getExamsNames); //Ottiene i nomi degli esami superati da uno studente
router.get("/examBooking/bookings/:mat", auth, ctrlBooking.getSessionsByMat); //Ottiene l'elenco delle prenotazioni per lo studente

//Corsi Docente
router.get("/professorPlan/:email", auth, ctrlPlan.getProfessorCoursesInfo); //Ottiene tutte le informazioni sui corsi tenuti da un docente
router.get("/examSession/courses/:email", auth, ctrlPlan.getProfessorCourses); //Ottiene l'elenco dei corsi assegnati ad un docente

//Gestione Appelli Docente
router.post("/examSession", ctrlSession.addExamSession); //Carica un nuovo appello
router.get(  "/examSession/session/:sessionId", auth, ctrlSession.getSessionsById); //Ottiene un appello per id
router.delete("/examSession/session/:sessionId", ctrlSession.deleteSessionById); //Cancella un appello
router.get(  "/examSession/sessions/:email", auth, ctrlSession.getSessionsByProfessor); //Ottiene l'elenco degli appelli caricati da un docente
router.get( "/examSession/students/:sessionId", auth, ctrlProfile.getStudentsBySession); //Ottiene l'elenco degli studenti prenotati ad un appello
router.delete("/examSession/bookingsOfSession/:sessionId", ctrlBooking.deleteBookingBySessionId); //Cancella le prenotazioni relative ad un appello eliminato
router.put( "/examSession/session/:sessionId/time/:time",ctrlSession.updateSessionTime); //Modifica l'ora di un appello
router.put( "/examSession/session/:sessionId/examType/:examType",ctrlSession.updateSessionType); //Modifica il tipo di prova di un appello
router.put( "/examSession/session/:sessionId/room/:room",ctrlSession.updateSessionRoom); //Modifica il luogo di un appello

//Verbalizzazione Docente
router.post("/registerExam", ctrlExam.addExam); //Registra un esame per uno studente
router.get( "/examSession/registeredExams/:sessionId", auth,ctrlSession.getRegisteredMat); //Ottiene l'elenco di matricole degli studenti per i quali un determinato esame è già stato verbalizzato

//Gestione Piano di Studi Admin
router.get("/plan", auth, ctrlPlan.getAllPlanInfo); //Restituisce tutti i piani di studio
router.post("/plan", ctrlPlan.addCourse); //Aggiunge un corso
router.delete("/plan/:courseId", ctrlPlan.deleteCourseById); //Cancella un corso
router.get("/plan/allThesis", auth, ctrlPlan.getAllPlanThesis); //Restituisce le tesi di tutti i piani di studi
router.put( "/plan/course/:courseId/mandatory/:mandatory",ctrlPlan.updateCourseMandatory); //Modifica l'ora di un appello
router.put( "/plan/course/:courseId/cfu/:cfu",ctrlPlan.updateCourseCfu); //Modifica il tipo di prova di un appello
router.put( "/plan/course/:courseId/semester/:semester",ctrlPlan.updateCourseSemester); //Modifica il luogo di un appello
router.put( "/plan/course/:courseId/professor/:professorEmail",ctrlPlan.updateCourseProfessor); //Modifica il luogo di un appello

//Gestione utenti Admin
router.get("/users", auth, ctrlProfile.getAllUsers); //Ottiene tutti gli utenti
router.delete("/profile/:_id", ctrlProfile.deleteUserById); //Elimina un utente tramite Id

//Tesi
router.post("/thesis/thesisRequest", ctrlThesis.addRequest); //Carica una richiesta di tesi
router.delete("/thesis/thesisRequest/:requestId", ctrlThesis.deleteRequest); //Cancella una richiesta inviata ad un docente
router.get("/thesis/thesisRequests/:email", ctrlThesis.getThesisRequests); //Ottiene tutte le richieste di tesi
router.get("/thesis/requestedThesis/:email", ctrlThesis.getRequestedThesis); //Ottiene tutte le richieste di tesi
router.get("/thesis/approvedThesis/:email", ctrlThesis.getApprovedThesis); //Ottiene la tesi approvata dal relatore
router.put("/thesis/approveRequest/:requestId", ctrlThesis.approveRequest); //Approva una richiesta di tesi

//Statistiche
router.get("/statistics/studentsAvg", auth, ctrlExam.getStudentsAvg); //Medie degli studenti per il grafico

module.exports = router;
