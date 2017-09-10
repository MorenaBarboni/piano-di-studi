(function() {
  angular.module("planApp").service("examService", examService);

  examService.$inject = ["$http", "$location", "authentication"];

  function examService($http, $location, authentication) {
    //Registra l'esito di un esame
    registerExam = function(exam) {
      return $http.post("/api/registerExam", exam).then(function(res) {
        return res.data;
      });
    };

    //Ottiene i dati completi degli esami superati da uno studente
    getStudentExams = function() {
      return $http
        .get("/api/career", {
          headers: {
            Authorization: "Bearer " + authentication.getToken()
          }
        })
        .then(handleSuccess, handleError);
    };

    //Ottiene solo i nomi degli esami superati da uno studente
    getStudentExamsNames = function(mat) {
      return $http
        .get("api/examBooking/studentExams/" + mat, {
          headers: {
            Authorization: "Bearer " + authentication.getToken()
          }
        })
        .then(handleSuccess, handleError);
    };

    //Ottiene la media aritmetica di ogni studente
    getStudentsAvg = function() {
      return $http
        .get("api/statistics/studentsAvg", {
          headers: {
            Authorization: "Bearer " + authentication.getToken()
          }
        })
        .then(handleSuccess, handleError);
    };

    //funzioni private
    function handleSuccess(res) {
      return res.data;
    }

    function handleError(res) {
      return $q.reject(res.data);
    }

    return {
      getStudentExams: getStudentExams,
      registerExam: registerExam,
      getStudentExamsNames: getStudentExamsNames,
      getStudentsAvg: getStudentsAvg
    };
  }
})();
