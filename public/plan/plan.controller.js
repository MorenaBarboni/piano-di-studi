(function() {
  angular.module("planApp").controller("planCtrl", planCtrl);

  planCtrl.$inject = ["$location", "planService", "userService", "$http", "$window", "$scope"];
  function planCtrl($location, planService, userService, $http, $window, $scope) {
    var vm = this;

    //Array contenente tutti i corsi
    vm.courses = [];

    //contatti per il footer
    vm.contacts = {};

    //Anni Accademici
    vm.entryYears = [];

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
    //nuova tesi
    vm.thesis = {
      faculty: "",
      subject: "Prova Finale",
      year: "",
      semester: "",
      cfu: "",
      email: "",
      entryYear: "",
      mandatory: true
    };

    //Tutte le tesi per il piano
    vm.planThesis = {};

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

    //Registra un corso
    vm.onSubmit = function() {
      if (
        vm.courseData.entryYear === 3 &&
        (vm.courseData === "Informatica" ||
          (vm.courseData === "Chimica")(vm.courseData === "Fisica"))
      ) {
        alert(
          "Inserito un anno di corso maggiore di 3 per una laurea triennale."
        );
      } else {
        planService.registerCourse(vm.courseData).then(function(status) {
          if (status.data === "error") {
            window.alert("Corso già registrato!");
          } else {
            window.alert("Corso registrato con successo");
            $window.location.reload();
          }
        });
      }
    };

    //Registra una tesi
    vm.submitThesis = function() {
      if (
        vm.thesis.faculty === "Informatica" ||
        vm.thesis.faculty === "Chimica" ||
        vm.thesis.faculty === "Fisica"
      ) {
        vm.thesis.year = 3;
      }
      planService.registerCourse(vm.thesis).then(function(status) {
        if (status.data === "error") {
          window.alert(
            "Tesi già registrata per questa facoltà ed anno accademico"
          );
        } else {
          window.alert("Tesi registrata con successo");
        }
        $window.location.reload();
      });
    };

    //inizializza il controller
    initController();

    function initController() {
      userService.getAdminEmails().then(function(data) {
        vm.contacts = data;
      });
      planService
        .getPlan()
        .then(function(plan) {
          vm.courses = plan;
        })
        .then(function() {
          planService.getAllPlanThesis().then(function(thesis) {
            vm.planThesis = thesis;
            console.log(vm.planThesis);
          });
        })
        .then(function() {
          removeDuplicateYears();
        });
    }

    //Cancella un corso o una tesi.
    $scope.deleteCourse = function(id, subj, deg, year) {
      if (!subj) {
        if (confirm("Vuoi davvero eliminare la tesi?") == true) {
          planService.deleteCourse(id);
          alert("Tesi eliminata con successo!");
          $window.location.reload();
        }
      } else {
        if (confirm("Vuoi davvero eliminare il corso?") == true) {
          planService.deleteCourse(id);
          alert("Corso eliminato con successo!");
          $window.location.reload();
        }
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
          vm.entryYears.push(value.entryYear);
        }
      });
    }
  }
})();
