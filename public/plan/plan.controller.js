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

    //Array contenente tutti i corsi
    vm.elements = [];

    vm.onSubmit = function() {
      planService.registerCourse(vm.credentials);
      window.alert("Corso aggiunto con successo");
      $window.location.reload();
    };

    //inizializza il controller
    initController();

    function initController() {
      planService.getPlan().then(function(plan) {
        vm.elements = plan;
      });
    }
  }
})();
