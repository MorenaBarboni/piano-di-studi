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
      authentication.register(vm.userData).error(function(err) {
        alert("err");
      });
      window.alert("Utente Registrato");
      window.location.reload();
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
