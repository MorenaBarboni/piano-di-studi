(function() {
  angular.module("planApp").controller("planCtrl", planCtrl);

  planCtrl.$inject = ["$location", "planService", "$http", "$window"];
  function planCtrl($location, planService, $http, $window) {
    console.log("Plan controller is running");

    var vm = this;

    //Per registrare un nuovo corso
    vm.courseData = {
      faculty: "Informatica", //Valore di default
      subject: "",
      year: "",
      semester: "",
      cfu: ""
    };

    //per filtrare i dati da mostrare
    vm.filter = {
      filterFaculty: "Informatica" //valore di default
    };

    //Per identificare il corso da eliminare
    vm.eraseData = {
      faculty: "Informatica", //default
      subject: ""
    };

    //Array contenente tutti i corsi
    vm.courses = [];

    vm.onSubmit = function() {
      planService.registerCourse(vm.courseData);
      window.alert("Corso aggiunto con successo");
      $window.location.reload();
    };

    vm.onDelete = function() {
      var deleteId = searchToDelete(vm.eraseData);
      console.log(vm.eraseData);
      planService.deleteCourse(deleteId);
      $window.location.reload();
    };

    //inizializza il controller
    initController();

    function initController() {
      planService.getPlan().then(function(plan) {
        vm.courses = plan;
      });
    }
   
    //Consente di ottenere l'id del corso da eliminare a partire da Facoltà e Corso.
    function searchToDelete(compare) {
      var subj = compare.subject;
      var faculty = compare.faculty;
      var lookup = {};
      for (var i = 0, len = vm.courses.length; i < len; i++) {
        if (vm.courses[i].subject === subj && vm.courses[i].faculty === faculty) {
          lookup = vm.courses[i];
        }
      }
      return lookup._id;
    }
  }
})();
