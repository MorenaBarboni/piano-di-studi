(function() {
  angular.module("planApp").controller("statisticsCtrl", statisticsCtrl);

  statisticsCtrl.$inject = [
    "$location",
    "$window",
    "userService",
    "examService",
    "$scope"
  ];
  function statisticsCtrl(
    $location,
    $window,
    userService,
    examService,
    $scope
  ) {
    var vm = this; //Controller

    vm.user = {}; //Dati utente

    vm.studentsAvg = {}; //Medie di ogni studente

    vm.totStudents = 0; //numero totale iscritti

    vm.informatica = 0; //numero totale iscritti informatica
    vm.chimica = 0; //numero totale iscritti  chimica
    vm.fisica = 0; //numero totale iscritti fisica

    vm.AvgInformatica = 0; //media finale Informatica
    vm.AvgChimica = 0; //media finale Chimica
    vm.AvgFisica = 0; //media finale Fisica

    var chartData = []; //dati per il grafico a torta
    var chartDataInformatica = []; //dati per il grafico di Informatica
    var chartDataChimica = []; //dati per il grafico di Chimica
    var chartDataFisica = []; //dati per il grafico di Fisica

    initController(); //Inizializza il controller

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
          examService
            .getStudentsAvg()
            .then(function(avgList) {
              console.log(avgList);
              vm.studentsAvg = avgList;
            })
            .then(function() {
              initChartData();
            })
            .then(function() {
              finalAvg();
            })
            .then(function() {
              userService
                .getFacultiesInfo()
                .then(function(data) {
                  vm.chartData = data;
                })
                .then(function() {
                  initPieChart();
                });
            });
        });
    }

    function finalAvg() {
      var sumInformatica = 0;
      var sumChimica = 0;
      var sumFisica = 0;
      var studentsInformatica = 0;
      var studentsChimica = 0;
      var studentsFisica = 0;

      for (var i = 0; i < chartDataInformatica.length; i++) {
        sumInformatica +=
          parseInt(chartDataInformatica[i].label) *
          chartDataInformatica[i].value;
        studentsInformatica += chartDataInformatica[i].value;
      }
      for (var j = 0; j < chartDataChimica.length; j++) {
        sumChimica +=
          parseInt(chartDataChimica[j].label) * chartDataChimica[j].value;
        studentsChimica += chartDataChimica[j].value;
      }
      for (var k = 0; k < chartDataFisica.length; k++) {
        sumFisica +=
          parseInt(chartDataFisica[k].label) * chartDataFisica[k].value;
        studentsFisica += chartDataFisica[k].value;
      }

      vm.AvgInformatica = (sumInformatica / studentsInformatica).toFixed(2);
      vm.AvgChimica = (sumChimica / studentsChimica).toFixed(2);
      vm.AvgFisica = (sumFisica / studentsFisica).toFixed(2);
    }

    //Grafico a torta
    vm.myDataSource = {
      chart: {
        animation: "1",
        caption: "Iscritti",
        startingangle: "120",
        showlabels: "0",
        showlegend: "1",
        enablemultislicing: "0",
        legendCaptionFontSize: "24",
        slicingdistance: "15",
        showpercentvalues: "1",
        showpercentintooltip: "1",
        showHoverEffect: "1",
        enableSmartLabels: "1",
        isSmartLineSlanted: "1",
        plotHighlightEffect: "1",
        palettecolors: "#BE3243,#CB999A,#f07e7e",
        plottooltext: "Facoltà : $label Iscritti : $value %",
        theme: "fint"
      },
      data: {}
    };

    //Grafico Informatica
    vm.myDataSourceInformatica = {
      chart: {
        xAxisName: "Media",
        yAxisName: "Numero di Studenti",
        paletteColors: "#BE6F71",
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
        yAxisNameFontSize: "15",
        xAxisNameFontSize: "15",
        valueFontSize: "13"
      },
      data: {}
    };

    //Grafico Chimica
    vm.myDataSourceChimica = {
      chart: {
        xAxisName: "Media",
        yAxisName: "Numero di Studenti",
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
        yAxisNameFontSize: "15",
        xAxisNameFontSize: "15",
        valueFontSize: "13"
      },
      data: {}
    };

    //Grafico Fisica
    vm.myDataSourceFisica = {
      chart: {
        xAxisName: "Media",
        yAxisName: "Numero di Studenti",
        paletteColors: "#f07e7e",
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
        yAxisNameFontSize: "15",
        xAxisNameFontSize: "15",
        valueFontSize: "13"
      },
      data: {}
    };

    //Inizializza i dati dei grafici delle facoltà
    function initChartData() {
      for (var i = 0; i < vm.studentsAvg.length; i++) {
        var faculty = vm.studentsAvg[i]._id.faculty;

        var ar = { label: "", value: "" };
        var added = false;

        ar.label = vm.studentsAvg[i].avgMark.toFixed(0);
        if (faculty === "Informatica") {
          for (var j = 0; j < chartDataInformatica.length; j++) {
            if (chartDataInformatica[j].label === ar.label) {
              chartDataInformatica[j].value++;
              added = true;
              break;
            }
          }
          if (!added) {
            ar.value = 1;
            chartDataInformatica.push(ar);
            added = false;
          }
        } else if (faculty === "Chimica") {
          for (var j = 0; j < chartDataChimica.length; j++) {
            if (chartDataChimica[j].label === ar.label) {
              chartDataChimica[j].value++;
              added = true;
              break;
            }
          }
          if (!added) {
            ar.value = 1;
            chartDataChimica.push(ar);
            added = false;
          }
        } else if (faculty === "Fisica") {
          for (var j = 0; j < chartDataFisica.length; j++) {
            if (chartDataFisica[j].label === ar.label) {
              chartDataFisica[j].value++;
              added = true;
              break;
            }
          }
          if (!added) {
            ar.value = 1;
            chartDataFisica.push(ar);
            added = false;
          }
        }
      }
      vm.myDataSourceInformatica.data = chartDataInformatica;
      vm.myDataSourceChimica.data = chartDataChimica;
      vm.myDataSourceFisica.data = chartDataFisica;
    }

    //Inizializza ill grafico a torta
    function initPieChart() {
      vm.totStudents = vm.chartData.length;

      for (var i = 0, len = vm.chartData.length; i < len; i++) {
        if (vm.chartData[i].faculty === "Informatica") {
          vm.informatica++;
        } else if (vm.chartData[i].faculty === "Fisica") {
          vm.fisica++;
        } else if (vm.chartData[i].faculty === "Chimica") {
          vm.chimica++;
        }
      }

      if (vm.informatica === 0) {
        percInf = 0;
      } else {
        var percInf = vm.informatica * 100 / vm.totStudents;
      }

      if (vm.chimica === 0) {
        percChim = 0;
      } else {
        var percChim = vm.chimica * 100 / vm.totStudents;
      }

      if (vm.fisica === 0) {
        percFis = 0;
      } else {
        var percFis = vm.fisica * 100 / vm.totStudents;
      }

      chartData.push(
        { label: "Informatica", value: percInf },
        { label: "Chimica", value: percChim },
        { label: "Fisica", value: percFis }
      );
      vm.myDataSource.data = chartData;
    }
  }
})();
