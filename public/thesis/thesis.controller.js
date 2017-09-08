(function() {
  angular.module("planApp").controller("thesisCtrl", thesisCtrl);

  thesisCtrl.$inject = [
    "$location",
    "userService",
    "thesisService",
    "$window",
    "$scope"
  ];
  function thesisCtrl($location, userService, thesisService, $window, $scope) {
    var vm = this;

    vm.user = {};

    //richiesta da inviare
    vm.thesisRequest = {
      title: "",
      professorEmail: "",
      studentEmail: "",
      notes: ""
    };

    //tesi richieste da più studenti ad un determinato docente
    vm.thesisRequests = {};
    //tesi richiesta da uno studente
    vm.requestedThesis = {};
    //tesi di uno studente approvata dal docente
    vm.approvedThesis = {};

    initController();

    function initController() {
      userService
        .getProfile()
        .success(function(data) {
          vm.user = data;
        })
        .error(function(e) {
          console.log(e);
        })
        .then(function() {
          if (vm.user.usertype === "studente") {
            thesisService
              .getRequestedThesis(vm.user.email)
              .then(function(thesis) {
                vm.requestedThesis = thesis;
              })
              .then(function() {
                thesisService.getThesis(vm.user.email).then(function(thesis) {
                  vm.approvedThesis = thesis;
                });
              });
          }
        })
        .then(function() {
          if (vm.user.usertype === "docente") {
            thesisService
              .getThesisRequests(vm.user.email)
              .then(function(thesisList) {
                vm.thesisRequests = thesisList;
              });
          }
        });
    }

    //Calcola l'anno di corso dello studente
    function getStudentYear(entryYear) {
      var entry = entryYear;
      var currentYear = new Date().getFullYear();
      var currentMonth = new Date().getMonth() + 1;

      if (entry === currentYear.toString()) {
        return 1;
      } else if (
        parseInt(currentYear) === parseInt(entry) + 1 &&
        currentMonth >= 9
      ) {
        return 2;
      } else if (
        parseInt(currentYear) === parseInt(entry) + 2 &&
        currentMonth >= 9
      ) {
        return 3;
      }
    }

    //Controlla se ci sono richieste inviate dallo studente non ancora approvate
    vm.sentRequestsEmpty = function() {
      if (vm.requestedThesis.length > 0) {
        return false;
      }
      return true;
    };

    //Controlla che la tesi dello studente sia stata approvata dal docente
    vm.approvedThesisEmpty = function() {
      if (vm.approvedThesis.length === 0) {
        return true;
      }
      return false;
    };
    //Controlla se il docente ha accettato almeno una richiesta
    vm.approvedRequestsEmpty = function() {
      for (var i = 0; i < vm.thesisRequests.length; i++) {
        if (vm.thesisRequests[i].approved) {
          return false;
        }
      }
      return true;
    };

    //Controlla se il docente ha richieste pendenti
    vm.hangingRequestsEmpty = function() {
      for (var i = 0; i < vm.thesisRequests.length; i++) {
        if (!vm.thesisRequests[i].approved) {
          return false;
        }
      }
      return true;
    };

    //Accetta richiesta tesi (docente)
    vm.approveRequest = function(requestId) {
      thesisService.approveThesis(requestId);
      $window.location.reload();
    };

    //Elimina una richiesta non ancora approvata dal docente (studente)
    vm.deleteRequest = function(requestId) {
      if (confirm("Vuoi davvero eliminare la richiesta?") == true) {
        thesisService.deleteRequest(requestId);
        $window.location.reload();
      }
    };

    //Richiedi Tesi (studente)

    vm.onSubmit = function() {
      if (
        (vm.user.faculty === "Informatica" ||
          vm.user.faculty === "Fisica" ||
          vm.user.faculty === "Chimica") &&
        getStudentYear(vm.user.entryYear) !== 3
      ) {
        alert(
          "Impossibile effettuare la richiesta. Non sei iscritto all'ultimo anno di corso."
        );
      } else {
        vm.thesisRequest.studentEmail = vm.user.email;
        thesisService.requestThesis(vm.thesisRequest).then(function(data) {
          if (data) {
            window.alert(
              "Impossibile inviare una nuova richiesta. Assicurati che non ci siano richieste pendenti, o che la richiesta inviata non sia già stata accettata."
            );
          } else {
            window.alert("Richiesta inviata con successo");
            $window.location.reload();
          }
        });
      }
    };
  }
})();
