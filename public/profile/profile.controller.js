(function() {
  angular.module("planApp").controller("profileCtrl", profileCtrl);

  profileCtrl.$inject = ["$location", "userService"];
  function profileCtrl($location, userService) {
    var vm = this;

    vm.user = {};

    userService
      .getProfile()
      .success(function(data) {
        vm.user = data;
      })
      .error(function(e) {
        console.log(e);
      });
  }
})();
