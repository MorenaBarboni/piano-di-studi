(function() {
  angular.module("planApp").controller("planCtrl", planCtrl);

  planCtrl.$inject = ["$location", "planService", "$http", "$window", "$scope"];
  function planCtrl($location, planService, $http, $window, $scope) {
    var vm = this;

    //Array contenente tutti i corsi
    vm.courses = [];

    //Anni Accademici
    vm.academicYears = [];

    //Nuovo corso
    vm.courseData = {
      faculty: "Informatica", //Valore di default
      subject: "",
      year: "",
      semester: "",
      cfu: "",
      professorEmail: "",
      entryYear: "",
      mandatory: ""
    };

    //Filtri per i dati da mostrare
    vm.filter = {
      filterFaculty: "Informatica",
      filterYear: "1",
      filterEntryYear: "2016"
    };

    //Determina quali righe della tabella filtrare e controlla se c'è almeno
    //una riga da mostrare

    vm.show = function(faculty, entryYear, year) {
      if (
        faculty.indexOf(vm.filter.filterFaculty) !== -1 &&
        vm.filter.filterFaculty !== "" &&
        entryYear.indexOf(vm.filter.filterEntryYear) !== -1 &&
        vm.filter.filterEntryYear !== "" &&
        year.toString().indexOf(vm.filter.filterYear) !== -1 &&
        vm.filter.filterYear !== ""
      ) {
        return true;
      }
      return false;
    };

    vm.onSubmit = function() {
      planService.registerCourse(vm.courseData);
      window.alert("Corso aggiunto con successo");
      $window.location.reload();
    };

    //inizializza il controller
    initController();

    function initController() {
      planService
        .getPlan()
        .then(function(plan) {
          vm.courses = plan;
        })
        .then(function() {
          removeDuplicateYears();
        });
    }

    //Cancella un corso.
    $scope.deleteCourse = function(id, subj, deg, year) {
      if (confirm("Vuoi davvero eliminare il corso?") == true) {
        planService.deleteCourse(id);
        alert("Corso eliminato con successo!");
        $window.location.reload();
      }
    };

    //Rimuove i duplicati degli anni accademici da ng-repeat
    function removeDuplicateYears() {
      keys = [];
      var i = 0;
      angular.forEach(vm.courses, function(value) {
        var key = vm.courses[i].entryYear;
        i++;
        if (keys.indexOf(key) === -1) {
          keys.push(key);
          vm.entryYear.push(value.entryYear);
        }
      });
    }
  }
})();
