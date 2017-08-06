(function() {
  angular.module("planApp").controller("planCtrl", planCtrl);

  planCtrl.$inject = ["$location", "planService", "$http", "$window"];
  function planCtrl($location, planService, $http, $window) {
    console.log("Plan controller is running");

    var vm = this;

    //Per registrare un nuovo corso
    vm.credentials = {
      degree: "Informatica", //Valore di default
      subject: "",
      year: "",
      semester: "",
      cfu: ""
    };

    //per filtrare i dati da mostrare
    vm.filter = {
      filterDegree: "Informatica" //valore di default
    };

    //Per identificare il corso da eliminare
    vm.eraseData = {
      degree: "Informatica", //default
      subject: ""
    };

    //Array contenente tutti i corsi
    vm.elements = [];

    vm.onSubmit = function() {
      planService.registerCourse(vm.credentials);
      window.alert("Corso aggiunto con successo");
      $window.location.reload();
    };

    vm.onDelete = function() {
      var deleteId = searchToDelete(vm.eraseData);
      planService.deleteCourse(deleteId);
      $window.location.reload();
    };

    //inizializza il controller
    initController();

    function initController() {
      planService.getPlan().then(function(plan) {
        vm.elements = plan;
      });
    }

    //Consente di ottenere l'id del corso da eliminare a partire da Facoltà e Corso.
    function searchToDelete(compare) {
      var subj = compare.subject;
      var deg = compare.degree;
      var lookup = {};
      for (var i = 0, len = vm.elements.length; i < len; i++) {
        if (vm.elements[i].subject === subj && vm.elements[i].degree === deg) {
          lookup = vm.elements[i];
        }
      }
      return lookup._id;
    }
  }
})();
