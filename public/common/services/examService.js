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

    //funzioni private
    function handleSuccess(res) {
      return res.data;
    }

    function handleError(res) {
      return $q.reject(res.data);
    }

    return {
      getStudentExams: getStudentExams,
      registerExam: registerExam
    };
  }
})();
