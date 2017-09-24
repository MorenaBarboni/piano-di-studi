(function() {
  angular.module("planApp").service("userService", userService);

  userService.$inject = ["$http", "authentication"];
  function userService($http, authentication) {
    //Ottiene i dati del profilo corrente
    var getProfile = function() {
      return $http.get("/api/profile", {
        headers: {
          Authorization: "Bearer " + authentication.getToken()
        }
      });
    };
    //Ottiene informazioni sugli iscritti alle varie facoltà
    getFacultiesInfo = function() {
      return $http
        .get("/api/facultiesInfo", {
          headers: {
            Authorization: "Bearer " + authentication.getToken()
          }
        })
        .then(handleSuccess, handleError);
    };

    //Ottiene tutti gli utenti
    getAllUsers = function() {
      return $http
        .get("/api/users", {
          headers: {
            Authorization: "Bearer " + authentication.getToken()
          }
        })
        .then(handleSuccess, handleError);
    };


    //Ottiene tutti i docenti
    getAllProfessors = function() {
      return $http
        .get("/api/user/professors", {
          headers: {
            Authorization: "Bearer " + authentication.getToken()
          }
        })
        .then(handleSuccess, handleError);
    };

       //Ottiene un docente per nome
       getProfessorByName = function(name) {
        return $http
          .get("/api/user/professor/" +name, {
            headers: {
              Authorization: "Bearer " + authentication.getToken()
            }
          })
          .then(handleSuccess, handleError);
      };

    //Cancella un utente tramite Id
    deleteUser = function(userId) {
      return $http
        .delete("/api/profile/" + userId)
        .success(function(data, status) {
          console.log(data);
        });
    };

    //Restituisce le email degli amministratori
    getAdminEmails = function() {
      return $http
        .get("/api/user/adminEmail", {
          headers: {
            Authorization: "Bearer " + authentication.getToken()
          }
        })
        .then(handleSuccess, handleError);
    };

     //Controlla l'esistenza dell'email di un docente
     checkEmail = function(professorEmail) {
      return $http
        .get("/api/user/professorEmail/" +professorEmail, {
          headers: {
            Authorization: "Bearer " + authentication.getToken()
          }
        })
        .then(handleSuccess, handleError);
    };

    getSessionStudents = function(sessionId) {
      return $http
        .get("/api/examSession/students/" + sessionId, {
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
      getProfile: getProfile,
      getFacultiesInfo: getFacultiesInfo,
      getAllUsers: getAllUsers,
      deleteUser: deleteUser,
      getSessionStudents: getSessionStudents,
      getAdminEmails: getAdminEmails,
      getAllProfessors:getAllProfessors,
      checkEmail:checkEmail,
      getProfessorByName : getProfessorByName 
    };
  }
})();
