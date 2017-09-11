(function() {
  angular.module("planApp").controller("profileCtrl", profileCtrl);

  profileCtrl.$inject = [
    "$location",
    "userService",
    "planService",
    "thesisService"
  ];
  function profileCtrl($location, userService, planService, thesisService) {
    var vm = this;

    vm.user = {}; //Utente corrente

    vm.planData = []; //Dati per il piano di studi studente

    vm.studentYear = 0; //Anno di corso a cui lo studente è iscritto

    vm.thesis = []; //Tesi assegnata allo studente

    vm.planThesis = {}; //Dettagli tesi del piano di studi

    vm.professorCourses = []; //Corsi di responsabilità del docente

    //Corsi suddivisi per anno
    vm.firstYear = [];
    vm.secondYear = [];
    vm.thirdYear = [];
    vm.fourthYear = [];
    vm.fifthYear = [];

    //Filtro per i corsi del docente
    vm.filterEntryYear = 2016;

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
        })
        .then(function() {
          if (vm.user.usertype === "studente") {
            planService
              .getStudentPlan()
              .then(function(plan) {
                vm.planData = plan;
              })
              .then(function() {
                sortYears();
              })
              .then(function() {
                planService
                  .getPlanThesis(vm.user.faculty, vm.user.entryYear)
                  .then(function(planThesis) {
                    vm.planThesis = planThesis;
                    console.log(planThesis);
                  });
              })
              .then(function() {
                thesisService.getThesis(vm.user.email).then(function(thesis) {
                  vm.thesis = thesis;
                });
              });
          }
        })
        .then(function() {
          if (vm.user.usertype === "docente") {
            planService
              .getProfessorCoursesInfo(vm.user.email)
              .then(function(professorCourses) {
                console.log(professorCourses);
                vm.professorCourses = professorCourses;
              });
          }
        });
    }

    vm.parseInt = function(year) {
      return parseInt(year);
    };

    //Filtro per coorte
    vm.checkCorrespondence = function(year) {
      if (year.indexOf(vm.filterEntryYear) !== -1 || vm.filterSubject === "") {
        return true;
      }
      return false;
    };

    //Controlla se il docente ha attualmente corsi attivi
    vm.isProfessorCoursesEmpty = function() {
      if (vm.professorCourses.length === 0) {
        return true;
      }
      return false;
    };

    //Controlla se c'è un piano di studi da mostrare
    vm.isPlanDataEmpty = function() {
      if (vm.planData.length === 0) {
        return true;
      }
      return false;
    };

    //Calcola l'anno di corso dello studente
    vm.getStudentYear = function(entryYear) {
      var entry = entryYear;
      var currentYear = new Date().getFullYear();
      var currentMonth = new Date().getMonth() + 1;

      if (entry === currentYear.toString()) {
        vm.studentYear = 1;
      } else if (
        parseInt(currentYear) === parseInt(entry) + 1 &&
        currentMonth >= 9
      ) {
        vm.studentYear = 2;
      } else if (
        parseInt(currentYear) === parseInt(entry) + 2 &&
        currentMonth >= 9
      ) {
        vm.studentYear = 3;
      }

      return vm.studentYear;
    };

    //Suddivide i corsi per anno
    function sortYears() {
      vm.planData.forEach(function(element) {
        if (element.year === 1) {
          vm.firstYear.push(element);
        } else if (element.year === 2) {
          vm.secondYear.push(element);
        } else if (element.year === 3) {
          vm.thirdYear.push(element);
        } else if (element.year === 4) {
          vm.fourthYear.push(element);
        } else if (element.year === 5) {
          vm.fifthYear.push(element);
        }
      }, this);
    }
  }
})();
