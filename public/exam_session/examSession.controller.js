(function() {
  angular.module("planApp").controller("examSessionCtrl", examSessionCtrl);

  examSessionCtrl.$inject = ["$location","userService","planService","sessionService","$window","$scope"];
  function examSessionCtrl($location, userService, planService, sessionService, $window, $scope) {
    var vm = this;

    vm.user = {}; //Utente

    vm.courses = {}; //Insegnamenti del docente

    vm.subjects = []; //Elenco nomi dei corsi

    vm.uploadedSessions = {}; //Appelli caricati dal docente

    vm.filterSubject = "";

    vm.contacts = {};

    //appello da caricare
    vm.session = {
      subject: "",
      degree: "",
      room: "",
      date: "",
      time: "",
      examType: "",
      entryYear: "",
      professorEmail: ""
    }; 

    //filtra gli appelli per nome del corso
    vm.checkCorrespondence = function(subject) {
      vm.filterSubject =
        vm.filterSubject.charAt(0).toUpperCase() + vm.filterSubject.slice(1);
      if (subject.indexOf(vm.filterSubject) !== -1 || vm.filterSubject === "") {
        return true;
      }
      return false;
    };

   
    initController();

   //inizializza il controller
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
          getProfessorCoursesList();
        })
        .then(function() {
          getProfessorSessionsList();
        });
    }

    //Ottiene l'elenco dei corsi del docente
    function getProfessorCoursesList() {
      planService
        .getProfessorCourses(vm.user.email)
        .then(function(courseList) {
          vm.courses = courseList;
        })
        .then(function() {
          removeDuplicateCourses();
        });
    }

    //Rimuovere i duplicati dei nomi dei corsi da vm.courses
    function removeDuplicateCourses() {
      keys = [];
      var i = 0;
      var output = [];
      angular.forEach(vm.courses, function(value) {
        var key = vm.courses[i].subject;
        i++;
        if (keys.indexOf(key) === -1) {
          keys.push(key);
          output.push(value.subject);
        }
      });
      vm.courses = output;
    }

    //Ottiene l'elenco degli appelli caricati dal docente
    function getProfessorSessionsList() {
      sessionService
        .getSessionsByProfessor(vm.user.email)
        .then(function(sessions) {
          vm.uploadedSessions = sessions;
        });
    }

    //Carica un appello
    vm.onSubmit = function() {

      var today = new Date();
      var inputDate = new Date(vm.session.date);

      if (inputDate <= today) {
        alert("Impossibile caricare l'appello: Data non valida");
      } else {
      
        var d = vm.session.date.toString();
        var h = vm.session.time.toString();
        var yyyy = d.slice(11, 15);
        var dd = d.slice(8, 10);
        var mm = d.slice(3, 7);
        var t = h.slice(16, 21);

        var dateParse = Date.parse(mm + "-" + dd + "-" + yyyy);

        if (!isNaN(dateParse)) {
          if (new Date(dateParse).getMonth() + 1 < 10) {
            vm.session.date =
              dd +
              "/" +
              ("0" + (new Date(dateParse).getMonth() + 1)) +
              "/" +
              yyyy;
          } else
            vm.session.date =
              dd + "/" + (new Date(dateParse).getMonth() + 1) + "-" + yyyy;
        }
        vm.session.time = t;
        vm.session.professorEmail = vm.user.email;
        sessionService.registerExamSession(vm.session);
        $window.location.reload();
      }
    };

    //Controlla se c'è almeno un appello da mostrare
    vm.isThereASession = function() {
      if (vm.uploadedSessions.length > 0) {
        return true;
      } else return false;
    };

    //Cancella un appello
    $scope.deleteSession = function(id) {
      if (
        confirm(
          "Eliminando l'appello non potrai più registrare gli esiti dell'esame. Procedere?"
        ) == true
      ) {
        sessionService.deleteSessionById(id);
        alert("Appello eliminato con successo!");
        $window.location.reload();
      }
    };

    //Ottiene l'elenco di studenti che si sono prenotati ad un determinato appello
    $scope.getStudentList = function(sessionId) {
      $location.url("/examSession/validation/" + sessionId);
    };
  }
})();
