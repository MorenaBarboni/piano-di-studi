(function() {
  angular.module("planApp").controller("registerCtrl", registerCtrl);

  registerCtrl.$inject = ["$location", "authentication", "$window", "userService"];
  function registerCtrl($location, authentication, $window, userService) {
    var vm = this;

    vm.contacts = {}; //Contatti per il footer

    var user = {}; //Utente Corrente

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

    initController();

    function initController() {
      userService.getAdminEmails().then(function(data) {
        vm.contacts = data;
      });
      userService
        .getProfile()
        .success(function(data) {
          vm.user = data;
        })
        .error(function(e) {
          console.log(e);
        });
    }

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
