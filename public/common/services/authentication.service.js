(function() {
  angular.module("planApp").service("authentication", authentication);

  authentication.$inject = ["$http", "$window", "$location"];
  function authentication($http, $window, $location) {
    var saveToken = function(token) {
      $window.localStorage["mean-token"] = token;
    };

    var getToken = function() {
      return $window.localStorage["mean-token"];
    };

    //Controlla se l'utente è loggato
    var isLoggedIn = function() {
      var token = getToken();
      var payload;

      if (token) {
        payload = token.split(".")[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);

        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };

    //restituisce gli attributi dell'utente corrente
    var currentUser = function() {
      if (isLoggedIn()) {
        var token = getToken();
        var payload = token.split(".")[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);
        return {
          email: payload.email,
          name: payload.name,
          usertype: payload.usertype,
          degree: payload.degree,
          mat: payload.mat,
          city: payload.city,
          street: payload.street,
          postalCode: payload.postalCode,
          tel: payload.tel
        };
      }
    };

    //controlla se l'utente è un amministratore
    var isAdmin = function() {
      if (isLoggedIn()) {
        var usr = currentUser().usertype;
        if (usr === "admin") {
          return true;
        } else return false;
      } else return false;
    };

    //controlla se l'utente è uno studente
    var isStudente = function() {
      if (isLoggedIn()) {
        var usr = currentUser().usertype;
        if (usr === "studente") {
          return true;
        } else return false;
      } else return false;
    };

    //controlla se l'utente è un docente
    var isDocente = function() {
      if (isLoggedIn()) {
        var usr = currentUser().usertype;
        if (usr === "docente") {
          return true;
        } else return false;
      } else return false;
    };
    //registra un utente
    register = function(user) {
      return $http.post("/api/register", user);
    };
    //login
    login = function(user) {
      return $http.post("/api/login", user).success(function(data) {
        saveToken(data.token);
      });
    };

    return {
      currentUser: currentUser,
      saveToken: saveToken,
      getToken: getToken,
      isLoggedIn: isLoggedIn,
      isAdmin: isAdmin,
      isStudente: isStudente,
      isDocente: isDocente,
      register: register,
      login: login
    };
  }
})();
