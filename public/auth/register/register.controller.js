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
      degree: "",
      mat: "",
      city: "",
      street: "",
      postalCode: "",
      tel: ""
    };

    vm.onSubmit = function() {
      authentication.register(vm.userData).error(function(err) {
        alert(err);
      });
      window.location.reload();
    };
  }
})();
