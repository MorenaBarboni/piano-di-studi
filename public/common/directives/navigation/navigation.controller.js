(function() {
  angular.module("planApp").controller("navigationCtrl", navigationCtrl);

  navigationCtrl.$inject = ["$location", "authentication"];
  function navigationCtrl($location, authentication) {
    var vm = this;
    
    vm.isAdmin = authentication.isAdmin();

    vm.isDocente = authentication.isDocente();

    vm.isStudente = authentication.isStudente();

    vm.isLoggedIn = authentication.isLoggedIn();

    vm.currentUser = authentication.currentUser();
  }
})();
