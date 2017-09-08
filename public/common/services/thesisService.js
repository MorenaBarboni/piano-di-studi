(function() {
  angular.module("planApp").service("thesisService", thesisService);

  thesisService.$inject = ["$http", "authentication"];
  function thesisService($http, authentication) {
    //Carica una nuova richiesta per la tesi
    requestThesis = function(thesis) {
      return $http
        .post("/api/thesis/thesisRequest", thesis)
        .then(function(res) {
          return res.data;
        });
    };

    //Accetta una richiesta tesi
    approveThesis = function(requestId) {
      return $http
        .put("/api/thesis/approveRequest/" + requestId)
        .then(function(res) {
          return res.data;
        });
    };

    //Ottiene tutte le richieste tesi ottenute da un docente da parte di più studenti
    getThesisRequests = function(email) {
      return $http
        .get("/api/thesis/thesisRequests/" + email)
        .then(handleSuccess, handleError);
    };

    //Ottiene tutte le richieste tesi inviate da uno studente a più docenti
    getRequestedThesis = function(email) {
      return $http
        .get("/api/thesis/requestedThesis/" + email)
        .then(handleSuccess, handleError);
    };

    //Ottiene la richiesta approvata dal relatore
    getThesis = function(email) {
      return $http
        .get("/api/thesis/approvedThesis/" + email)
        .then(handleSuccess, handleError);
    };

    //Cancella tutte le prenotazioni quando il relativo appello viene eliminato -- Docente
    deleteRequest = function(requestId) {  
      return $http.delete("/api/thesis/thesisRequest/" + requestId);
    };

    function handleSuccess(res) {
      return res.data;
    }

    function handleError(res) {
      return $q.reject(res.data);
    }

    return {
      requestThesis: requestThesis,
      getThesisRequests: getThesisRequests,
      approveThesis: approveThesis,
      getThesis: getThesis,
      getRequestedThesis: getRequestedThesis,
      deleteRequest: deleteRequest
    };
  }
})();
