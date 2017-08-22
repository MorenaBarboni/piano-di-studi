(function() {
  angular.module("planApp").controller("profileCtrl", profileCtrl);

  profileCtrl.$inject = ["$location", "userService", "planService"];
  function profileCtrl($location, userService, planService) {
    var vm = this;

    vm.user = {};

    vm.planData = []; //Dati piano di studi -- studente

    vm.professorCourses = []; //Corsi di responsabilità del docente -- docente

    var chartData = []; //dati per il grafico a torta -- admin

    vm.totStudents = 0; //numero totale iscritti -- admin
    vm.informatica = 0; //numero totale iscritti informatica -- admin
    vm.farmacia = 0; //numero totale iscritti  farmacia -- admin
    vm.giurisprudenza = 0; //numero totale iscritti giurisprudenza -- admin
    vm.fisica = 0; //numero totale iscritti fisica  -- admin

    //Corsi suddivisi per anno
    vm.firstYear = [];
    vm.secondYear = [];
    vm.thirdYear = [];
    vm.fourthYear = [];
    vm.fifthYear = [];

    //Grafico
    vm.myDataSource = {
      chart: {
        caption: "Iscritti",
        startingangle: "120",
        showlabels: "0",
        showlegend: "1",
        enablemultislicing: "0",
        slicingdistance: "15",
        showpercentvalues: "1",
        showpercentintooltip: "0",
        palettecolors: "#BE3243,#986667,#BE6F71,#CB999A,#DFC0B1,#E0D0D0",
        plottooltext: "Facoltà : $label Iscritti : $datavalue %",
        theme: "fint"
      },
      data: {}
    };

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
          //Dati piano di studi
          if (vm.user.usertype === "studente") {
            planService
              .getStudentPlan()
              .then(function(plan) {
                vm.planData = plan;
              })
              .then(function() {
                sortYears();
              });
          }
        })
        .then(function() {
          //Dati corsi docente
          if (vm.user.usertype === "docente") {
            planService
              .getProfessorCoursesInfo(vm.user.email)
              .then(function(professorCourses) {
                vm.professorCourses = professorCourses;
              });
          }
        })
        .then(function() {
          if (vm.user.usertype === "admin") {
            //Dati per il grafico
            userService
              .getFacultiesInfo()
              .then(function(data) {
                vm.chartData = data;
              })
              .then(function() {
                initPieChart();
              });
          }
        });
    }
    //Controlla se il docente ha attualmente corsi attivi
    vm.isProfessorCoursesEmpty = function() {
      if (vm.professorCourses.length === 0) {
        return true;
      }
      return false;
    };

    vm.isPlanDataEmpty = function() {
      if (vm.planData.length === 0) {
        return true;
      }
      return false;
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

    //Inizializza il grafico
    function initPieChart() {
      vm.totStudents = vm.chartData.length;

      for (var i = 0, len = vm.chartData.length; i < len; i++) {
        if (vm.chartData[i].faculty === "Informatica") {
          vm.informatica++;
        } else if (vm.chartData[i].faculty === "Farmacia") {
          vm.farmacia++;
        } else if (vm.chartData[i].faculty === "Giurisprudenza") {
          vm.giurisprudenza++;
        } else if (vm.chartData[i].faculty === "Fisica") {
          vm.fisica++;
        }
      }

      if (vm.informatica === 0) {
        percInf = 0;
      } else {
        var percInf = vm.informatica * 100 / vm.totStudents;
        console.log(percInf);
      }

      if (vm.farmacia === 0) {
        percFar = 0;
      } else {
        var percFar = vm.farmacia * 100 / vm.totStudents;
        console.log(percFar);
      }

      if (vm.fisica === 0) {
        percFis = 0;
      } else {
        var percFis = vm.fisica * 100 / vm.totStudents;
        console.log(percFis);
      }

      if (vm.giurisprudenza === 0) {
        percGiu = 0;
      } else {
        var percGiu = vm.giurisprudenza * 100 / vm.totStudents;
        console.log(percGiu);
      }
      chartData.push(
        { label: "Informatica", value: percInf },
        { label: "Farmacia", value: percFar },
        { label: "Fisica", value: percFis },
        { label: "Giurisprudenza", value: percGiu }
      );
      vm.myDataSource.data = chartData;
    }
  }
})();
