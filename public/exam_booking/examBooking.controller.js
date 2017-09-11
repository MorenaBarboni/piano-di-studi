(function() {
  angular.module("planApp").controller("bookingCtrl", bookingCtrl);

  bookingCtrl.$inject = [
    "$location",
    "$window",
    "userService",
    "sessionService",
    "bookingService",
    "examService",
    "$scope"
  ];
  function bookingCtrl(
    $location,
    $window,
    userService,
    sessionService,
    bookingService,
    examService,
    $scope
  ) {
    var vm = this; //Controller

    vm.user = {}; //Dati studente

    vm.contacts = {}; //Contatti per il footer

    vm.studentYear = 1; //Anno di corso a cui lo studente è iscritto

    vm.sessionList = []; //Elenco degli appelli disponibili

    vm.bookingsList = []; //Elenco delle prenotazioni effettuate dallo studente

    vm.examsList = []; //Elenco degli esami già superati

    vm.filterSubject = ""; //Filtro appelli

    //Dati prenotazione da effettuare
    vm.bookingData = {
      mat: "",
      examSession_id: ""
    };

    //Filtra gli appelli da mostrare
    vm.checkCorrespondence = function(subject) {
      vm.filterSubject =
        vm.filterSubject.charAt(0).toUpperCase() + vm.filterSubject.slice(1);

      if (subject.indexOf(vm.filterSubject) !== -1 || vm.filterSubject === "") {
        return true;
      }
      return false;
    };

    initController(); //Inizializza il controller

    function initController() {
      userService.getAdminEmails().then(function(data) {
        vm.contacts = data;
      });
      userService
        .getProfile()
        .success(function(data) {
          vm.user = data;
        })
        .error(function(e) {
          console.log(e);
        })
        .then(function() {
          getStudentYear();
        })
        .then(function() {
          getExamList();
        });
    }

    //Ottiene l'elenco degli esami già registrati
    function getExamList() {
      examService
        .getStudentExamsNames(vm.user.mat)
        .then(function(examList) {
          vm.examsList = examList;
        })
        .then(function() {
          getSessionList();
        });
    }

    //Ottiene l'elenco degli appelli per facoltà e anno accademico
    function getSessionList() {
      sessionService
        .getAvailableSessions(vm.user.faculty, vm.user.entryYear)
        .then(function(sessionList) {
          vm.sessionList = sessionList;
        })
        .then(function() {
          getBookingsByMat();
        });
    }

    //Ottiene l'elenco degli appelli prenotati dallo studente
    function getBookingsByMat() {
      bookingService.getBookings(vm.user.mat).then(function(bookingsList) {
        vm.bookingsList = bookingsList;
      });
    }

    //Calcola l'anno di corso dello studente
    function getStudentYear() {
      var currentYear = new Date().getFullYear();
      var currentMonth = new Date().getMonth() + 1;

      if (vm.user.entryYear === currentYear.toString()) {
        vm.studentYear = 1;
      } else if (
        parseInt(currentYear) === parseInt(vm.user.entryYear) + 1 &&
        currentMonth >= 9
      ) {
        vm.studentYear = 2;
      } else if (
        parseInt(currentYear) === parseInt(vm.user.entryYear) + 2 &&
        currentMonth >= 9
      ) {
        vm.studentYear = 3;
      }
    }

    //Restituisce true se un appello è già stato prenotato, corrisponde ad un esame
    //già superato dallo studente, si è già svolto o  è per un anno di corso superiore.

    vm.hideSession = function(sessionId, subject, date, year) {
      if (date) {
        var today = new Date();
        d =
          date.toString().slice(3, 5) +
          "/" +
          date.toString().slice(0, 2) +
          date.toString().slice(5);
        examDate = new Date(d);
        if (examDate < today) {
          return true;
        }
      }
      if (year) {
        if (vm.studentYear < year) {
          return true;
        }
      }
      for (var j = 0; j < vm.bookingsList.length; j++) {
        var b = vm.bookingsList[j];
        if (sessionId === b.examSession_id) {
          return true;
        }
      }
      for (var l = 0; l < vm.examsList.length; l++) {
        var e = vm.examsList[l];
        if (subject === e.subject) {
          return true;
        }
      }
      return false;
    };

    //Controlla se tutti gli appelli disponibili sono stati prenotati
    vm.isEverySessionBooked = function() {
      for (var i = 0; i < vm.sessionList.length; i++) {
        var s = vm.sessionList[i];
        if (!vm.hideSession(s.session_id, s._id.subject, s._id.date, s.year)) {
          return false;
        }
      }
      return true;
    };

    //Controlla se c'è almeno un appello da mostrare
    vm.isThereASessionBooked = function() {
      if (vm.bookingsList.length > 0) {
        return true;
      } else return false;
    };

    //Prenota un appello
    $scope.bookSession = function(id, date) {
      var today = new Date();

      d = date.slice(3, 5) + "/" + date.slice(0, 2) + date.slice(5);
      examDate = new Date(d);

      if (today >= examDate) {
        alert(
          "Impossibile prenotare l'appello. Puoi prenotarti fino al giorno precedente allo svolgimento della prova."
        );
      } else {
        if (confirm("Vuoi davvero prenotarti?") == true) {
          vm.bookingData.mat = vm.user.mat;
          vm.bookingData.examSession_id = id;
          bookingService.addBooking(vm.bookingData);
          alert("Prenotazione effettuata con successo!");
          $window.location.reload();
        }
      }
    };

    //Cancella una prenotazione
    $scope.deleteBooking = function(id, date) {
      var today = new Date();

      d = date.slice(3, 5) + "/" + date.slice(0, 2) + date.slice(5);
      examDate = new Date(d);

      if (today >= examDate) {
        alert("Impossibile eliminare la prenotazione");
      } else {
        if (confirm("Vuoi davvero eliminare la prenotazione?") == true) {
          bookingService.deleteBooking(id);
          alert("Prenotazione eliminata con successo!");
          $window.location.reload();
        }
      }
    };
  }
})();
