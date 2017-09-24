(function() {
  angular
    .module("planApp")
    .controller("professorSearchCtrl", professorSearchCtrl);
  professorSearchCtrl.$inject = [
    "$location",
    "userService",
    "planService",
    "$http",
    "$window",
    "$scope",
    "$window"
  ];
  function professorSearchCtrl(
    $location,
    userService,
    planService,
    $http,
    $window,
    $scope,
    $location
  ) {
    var vm = this;

    vm.user = {}; //Utente corrente

    vm.contacts = {}; //contatti per il footer

    vm.users = []; //Elenco di tutti gli utenti

    //Filtri docente
    vm.filter = {
      filterName: "",
      filterFaculty: ""
    };

    //Filtro per i corsi del docente
    vm.filterEntryYear = 2016;
    //Ricerca docente
    vm.professorName = "";
    //Docenti ottenuti dalla ricerca
    vm.professor = [];
    //Corsi dei docenti
    vm.professorCourses = [];

    //Determina quali righe della tabella filtrare
    vm.checkCorrespondence = function(name, faculty) {
      vm.filter.filterFaculty =
        vm.filter.filterFaculty.charAt(0).toUpperCase() +
        vm.filter.filterFaculty.slice(1);
      vm.filter.filterName =
        vm.filter.filterName.charAt(0).toUpperCase() +
        vm.filter.filterName.slice(1);
      if (
        name.indexOf(vm.filter.filterName) !== -1 &&
        faculty.indexOf(vm.filter.filterFaculty) !== -1
      ) {
        return true;
      }
      return false;
    };

    //Filtro per coorte
    vm.checkCorrespondence = function(year) {
      if (year.indexOf(vm.filterEntryYear) !== -1 || vm.filterSubject === "") {
        return true;
      }
      return false;
    };

    //ricerca docente per nome
    vm.onSubmit = function() {
      if (vm.professorName !== "") {
        userService.getProfessorByName(vm.professorName).then(function(data) {
          vm.professor = data;
          if (vm.professorCourses.length > 0) {
            vm.professorCourses = []
          }
          if (data) {
            for (var i = 0; i < vm.professor.length; i++) {
              planService
                .getProfessorCoursesInfo(vm.professor[i].email)
                .then(function(courses) {
                  vm.professorCourses.push(courses);
                });
            }
          }
        });
      } else {
        alert("Inserisci nome e cognome per ricercare un docente");
      }
    };

    initController();

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
        });

      //Ottiene l'elenco degli utenti
      userService.getAllProfessors().then(function(users) {
        vm.users = users;
      });
    }
  }
})();
