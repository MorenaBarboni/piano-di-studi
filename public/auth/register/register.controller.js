(function() {
  angular.module("planApp").controller("registerCtrl", registerCtrl);

  registerCtrl.$inject = ["$location", "authentication", "$window"];
  function registerCtrl($location, authentication, $window) {
    var vm = this;

    vm.userData = {
      name: "",
      email: "",
      password: "",
      usertype: "studente", //default
      faculty: "",
      mat: "",
      city: "",
      street: "",
      postalCode: "",
      tel: "",
      entryYear: ""
    };

    vm.onSubmit = function() {
      authentication.register(vm.userData).then(function(response) {
        if (response.data === "error") {
          window.alert("Matricola già esistente!");
        } else {
          window.alert("Utente registrato con successo");
          window.location.reload();
        }
      });
    };

    //Resetta il controller al cambiare dei permessi utente
    resetCtrl = function() {
      vm.userData = {
        name: "",
        email: "",
        password: "",
        faculty: "",
        mat: "",
        city: "",
        street: "",
        postalCode: "",
        tel: "",
        entryYear: ""
      };
    };
  }
})();
