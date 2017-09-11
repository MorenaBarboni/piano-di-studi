(function() {
  angular.module("planApp").controller("careerCtrl", careerCtrl);

  function careerCtrl(planService, userService, examService, $http) {
    var vm = this;

    vm.user = {}; //Dati utente

    vm.contacts = {}; //Contatti per il footer

    vm.courses = []; //Lista corsi

    //Suddivisione dei corsi per anno
    vm.firstYear = [];
    vm.secondYear = [];
    vm.thirdYear = [];
    vm.fourthYear = [];
    vm.fifthYear = [];
    vm.optional = [];

    vm.exams = []; //Lista esami registrati

    vm.arithmeticAvg = 0; //media aritmetica
    vm.weightedAvg = 0; //media ponderata
    vm.totCfu = 0; //totale crediti
    vm.score = 0; //base di laurea

    //Media Attesa - Pianificazione
    vm.wantedAvg = "";
    vm.neededAvg = "";

    //Media e base di laurea prevista - Proiezione Voto
    vm.expectedArithmeticAvg;
    vm.expectedWeightedAvg;
    vm.expectedScore;

    // Indica la votazione da conseguire nei prossimi esami per raggiungere una media pari all'input utente
    vm.getNeededAvg = function(inputAvg) {
      if (vm.totCfu === 0) {
        vm.neededAvg = inputAvg;
      } else {
        vm.neededAvg = ((inputAvg * 180 - vm.weightedAvg * vm.totCfu) /
          (180 - vm.totCfu)).toFixed(2);
      }
    };
    // Resetta i form
    vm.resetFirstForm = function() {
      vm.neededAvg = "";     
      };

    vm.resetSecondForm = function() {
      vm.expectedArithmeticAvg = "";
      vm.expectedWeightedAvg = "";
      vm.expectedScore = "";
      };

    // Calcola l'eventuale media ponderata, aritmetica e base di laurea a seconda del voto e dei crediti inseriti dall'utente
    vm.getExpectedAvg = function(inputMark, inputCfu) {
      var markSum = inputMark;
      var weightedMarkSum = inputMark * inputCfu;
      var cfus = inputCfu;

      for (var k = 0; k < vm.courses.length; k++) {
        if (vm.courses[k].mark != null) {
          markSum = markSum + vm.courses[k].mark;
          weightedMarkSum =
            weightedMarkSum + vm.courses[k].mark * vm.courses[k].cfu;
          cfus = cfus + vm.courses[k].cfu;
        }
      }
      vm.expectedArithmeticAvg = (markSum / (vm.exams.length + 1)).toFixed(2);
      vm.expectedWeightedAvg = (weightedMarkSum / cfus).toFixed(2);
      vm.expectedScore = (vm.expectedWeightedAvg * 110 / 30).toFixed(2);
    };

    //Dati per il grafico
    var chartData = [];

    vm.myDataSource = {
      chart: {
        caption: "Andamento degli Esami",
        xAxisName: "Esami",
        yAxisName: "Voti",
        paletteColors: "#cb999a",
        bgColor: "#ffffff",
        borderAlpha: "20",
        canvasBorderAlpha: "1",
        usePlotGradientColor: "0",
        plotBorderAlpha: "10",
        placevaluesInside: "1",
        rotatevalues: "0",
        valueFontColor: "#ffffff",
        showXAxisLine: "1",
        xAxisLineColor: "#999999",
        divlineColor: "#999999",
        divLineDashed: "1",
        showAlternateHGridColor: "0",
        subcaptionFontBold: "0",
        subcaptionFontSize: "14",
        yAxisMaxValue: "30",
        yAxisMinValue: "15",
        yAxisNameFontSize: "15",
        xAxisNameFontSize: "15",
        valueFontSize: "13"
      },
      data: {}
    };

    //Inizializza il controller
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
          examService.getStudentExams().then(function(examList) {
            vm.exams = examList;
          });
        })
        .then(function() {
          planService
            .getStudentPlan()
            .then(function(plan) {
              vm.courses = plan;
            })
            .then(function() {
              setRegistered();
            })
            .then(function() {
              sortYears();
            })
            .then(function() {
              avg();
            })
            .then(function() {
              initChartData();
            });
        });
    }

    //Suddivide i corsi per anno
    function sortYears() {
      vm.courses.forEach(function(element) {
        if (element.year === 1 && element.mandatory) {
          vm.firstYear.push(element);
        } else if (element.year === 2 && element.mandatory) {
          vm.secondYear.push(element);
        } else if (element.year === 3 && element.mandatory) {
          vm.thirdYear.push(element);
        } else if (element.year === 4 && element.mandatory) {
          vm.fourthYear.push(element);
        } else if (element.year === 5 && element.mandatory) {
          vm.fifthYear.push(element);
        } else if (!element.mandatory) {
          vm.optional.push(element);
        }
      }, this);
    }

    //Determina se un esame è stato registrato
    function setRegistered() {
      for (var i = 0, cLen = vm.courses.length; i < cLen; i++) {
        for (var j = 0, eLen = vm.exams.length; j < eLen; j++) {
          var course = vm.courses[i];
          var exam = vm.exams[j];
          if (course.subject === exam.subject) {
            vm.courses[i].registered = true;
            vm.courses[i].mark = vm.exams[j].mark;
            vm.courses[i].examDate = vm.exams[j].examDate;
            console.log("Registered: " + vm.courses[i].subject);
          }
        }
      }
    }

    //Calcola media aritmetica, media ponderata, totale dei cfu e base di laurea
    function avg() {
      var sum = 0;
      var weightedSum = 0;
      var cfuSum = 0;

      for (var k = 0, l = vm.courses.length; k < l; k++) {
        if (vm.courses[k].mark != null) {
          if (vm.courses[k].mark === 31) {
            sum = sum + 30;
            weightedSum = weightedSum + 30 * vm.courses[k].cfu;
          } else {
            sum = sum + vm.courses[k].mark;
            weightedSum = weightedSum + vm.courses[k].mark * vm.courses[k].cfu;
          }
          cfuSum = cfuSum + vm.courses[k].cfu;
        }
      }
      vm.arithmeticAvg = (sum / vm.exams.length).toFixed(2);
      vm.weightedAvg = (weightedSum / cfuSum).toFixed(2);
      vm.score = (vm.weightedAvg * 110 / 30).toFixed(2);
      vm.totCfu = cfuSum;
    }

    //Inizializza i dati per il grafico
    function initChartData() {
      for (var i = 0, len = vm.exams.length; i < len; i++) {
        var ar = { label: "", value: "" };
        ar.label = vm.exams[i].subject;
        if (vm.exams[i].mark === 31) {
          ar.value = 30;
        } else {
          ar.value = vm.exams[i].mark;
        }
        chartData.push(ar);
        console.log(chartData[i]);
      }
      vm.myDataSource.data = chartData;
    }
  }
})();
