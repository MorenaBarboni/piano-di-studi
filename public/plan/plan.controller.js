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
      academicYear: ""
    };

    //Filtri per i dati da mostrare
    vm.filter = {
      filterFaculty: "Informatica",
      filterYear: "1",
      filterAcademicYear: "2017"
    };

    //Controllano la visibilità dei dati nella tabella
    vm.visibleRows = 0;
    vm.checks = 0;

    //Determina quali righe della tabella filtrare e controlla se c'è almeno
    //una riga da mostrare

    vm.checkCorrespondence = function(faculty, academicYear, year) {
      vm.filter.filterFaculty =
        vm.filter.filterFaculty.charAt(0).toUpperCase() +
        vm.filter.filterFaculty.slice(1);

      if (
        faculty === vm.filter.filterFaculty &&
        academicYear === vm.filter.filterAcademicYear &&
        (year === Number(vm.filter.filterYear) || vm.filter.filterYear === "")
      ) {
        if (vm.checks === vm.courses.length) {
          vm.checks = 0;
          vm.visibleRows = 0;
        }
        vm.checks = vm.checks + 1;
        vm.visibleRows = vm.visibleRows + 1;
        return true;
      } else {
        if (vm.checks === vm.courses.length) {
          vm.checks = 0;
          vm.visibleRows = 0;
        }
        vm.checks = vm.checks + 1;
        return false;
      }
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
        var key = vm.courses[i].academicYear;
        i++;
        if (keys.indexOf(key) === -1) {
          keys.push(key);
          vm.academicYears.push(value.academicYear);
        }
      });
    }
  }
})();
