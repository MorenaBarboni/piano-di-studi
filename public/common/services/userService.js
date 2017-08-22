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

    //funzioni private
    function handleSuccess(res) {
      return res.data;
    }

    function handleError(res) {
      return $q.reject(res.data);
    }

    return {
      getProfile: getProfile,
      getFacultiesInfo: getFacultiesInfo
    };
  }
})();
