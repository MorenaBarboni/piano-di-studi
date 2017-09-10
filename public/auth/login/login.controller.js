(function() {
  angular.module("planApp").controller("loginCtrl", loginCtrl);

  loginCtrl.$inject = ["$location", "authentication", "userService"];
  function loginCtrl($location, authentication, userService) {
    var vm = this;

    vm.user = {};

    vm.accessData = {
      email: "",
      password: ""
    };

    vm.onSubmit = function() {
      authentication
        .login(vm.accessData)
        .error(function(err) {
          alert("Email o password errata");
        })
        .then(function() {
          userService
            .getProfile()
            .success(function(data) {
              vm.user = data;
            })
            .error(function(e) {
              console.log(e);
            })
            .then(function() {
              if (vm.user.usertype === "admin") {
                console.log(vm.user.usertype);
                $location.path("usersManagement");
              } else {
                console.log(vm.user.usertype);
                $location.path("profile");
              }
            });
        });
    };
  }
})();
