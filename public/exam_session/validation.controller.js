(function() {
  angular
    .module("planApp")
    .controller("validationCtrl", validationCtrl);

    validationCtrl.$inject = ["$location","$routeParams","userService","planService", "sessionService","examService", "$window", "$scope"];
  function validationCtrl( $location, $routeParams, userService, planService, sessionService, examService, $window, $scope) {
   
    var vm = this;

    var sessionId = $routeParams.sessionId; //Id dell'appello

    vm.user = {}; //Utente

    vm.studentsList = []; //Elenco studenti prenotati

    vm.sessionData = {}; //Dati dell'appello

    vm.registeredMatsList = {}; //Matricole degli studenti per cui l'esame è stato verbalizzato

    vm.contacts = {};

    //Esame da registrare
    var examData = {
      subject: "",
      mat: "",
      mark: "",
      examDate: ""
    };

    initController();

    //Inizializza il controller
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
          getSessionData();
        })
        .then(function() {
          userService
            .getSessionStudents(sessionId)
            .then(function(studentsList) {
              vm.studentsList = studentsList;
            });
        })
        .then(function() {
          sessionService.getRegisteredExamsMats(sessionId).then(function(mats) {
            vm.registeredMatsList = mats;
          });
        });
    }

    //Controlla se ci sono prenotazioni
    vm.isStudentsListEmpty = function() {
      if (vm.studentsList.length === 0) {
        return true;
      } else return false;
    };

    //Se il voto è stato registrato mostra l'esito
    vm.isRegistered = function(mat) {
      var ar = [];
      for (var i = 0; i < vm.registeredMatsList.length; i++) {
        if (mat === vm.registeredMatsList[i].mat) {
          if(vm.registeredMatsList[i].mark === 31){
            return "30 L";
          }
          return vm.registeredMatsList[i].mark;
        }
      }
      return null;
    };

    //Ottiene i dati dell'appello
    function getSessionData() {
      sessionService.getSessionById(sessionId).then(function(data) {
        vm.sessionData = data;
      });
    }

    //Registra un esame
    $scope.registerExam = function(mark, mat) {
      var today = new Date();
  
      d = vm.sessionData[0].date.slice(3, 5) + "/" +  vm.sessionData[0].date.slice(0, 2) +
      vm.sessionData[0].date.slice(5);
      
      examDate = new Date(d);

      if (today < examDate) {
        alert(
          "Impossibile registrare l'esito prima dello svolgimento della prova"
        );
      } else {
        if (!mark) {
          alert("Nessun voto inserito");
        } else {
          if (
            confirm(
              "Una volta verbalizzato, il voto non può più essere modificato. Continuare?"
            ) == true
          ) {
            examData.mat = mat;
            examData.mark = mark;
            examData.subject = vm.sessionData[0].subject;
            examData.examDate = vm.sessionData[0].date;
            examService.registerExam(examData).then(function(data) {
              if (data) {
                window.alert("Esame già registrato!");
              } else {
                window.alert("Esame registrato con successo");
              }
            });
          }
          $window.location.reload();
        }
      }
    };
  }
})();
