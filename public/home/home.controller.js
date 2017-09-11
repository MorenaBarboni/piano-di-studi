(function() {
  angular.module("planApp").controller("homeCtrl", homeCtrl);

  homeCtrl.$inject = ["$location", "userService"];
  function homeCtrl($location, userService) {
    var vm = this;

    vm.user = [];

    //email degli admin per il footer
    vm.contacts = {};

    initController(); //Inizializza il controller

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
  }
})();
