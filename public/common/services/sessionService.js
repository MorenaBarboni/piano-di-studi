(function() {
  angular.module("planApp").service("sessionService", sessionService);

  sessionService.$inject = ["$http", "$location", "$q", "authentication"];

  function sessionService($http, $location, $q, authentication) {
    //Carica un nuovo appello
    registerExamSession = function(examSession) {
      return $http.post("/api/examSession", examSession);
    };

    //Ottiene un appello
    getSessionById = function(sessionId) {
      return $http
        .get("/api/examSession/session/" + sessionId, {
          headers: {
            Authorization: "Bearer " + authentication.getToken()
          }
        })
        .then(handleSuccess, handleError);
    };

    //Ottiene l'elenco delle matricole degli studenti registrati ad un determinato appello
    getRegisteredExamsMats = function(sessionId) {
      return $http
        .get("/api/examSession/registeredExams/" + sessionId, {
          headers: {
            Authorization: "Bearer " + authentication.getToken()
          }
        })
        .then(handleSuccess, handleError);
    };

    //Ottiene l'elenco degli appelli caricati dal docente
    getSessionsByProfessor = function(professorEmail) {
      return $http
        .get("/api/examSession/sessions/" + professorEmail, {
          headers: {
            Authorization: "Bearer " + authentication.getToken()
          }
        })
        .then(handleSuccess, handleError);
    };

    //Elimina un appello caricato dal docente
    deleteSessionById = function(sessionId) {
      return $http
        .delete("/api/examSession/session/" + sessionId)
        .success(function(data, status) {
          console.log(data);
        });
    };

    //funzioni private

    function handleSuccess(res) {
      return res.data;
    }

    function handleError(res) {
      return $q.reject(res.data);
    }

    return {
      registerExamSession: registerExamSession,
      getSessionsByProfessor: getSessionsByProfessor,
      deleteSessionById: deleteSessionById,
      getSessionById: getSessionById,
      getRegisteredExamsMats: getRegisteredExamsMats
    };
  }
})();
