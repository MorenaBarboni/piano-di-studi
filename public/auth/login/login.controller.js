(function () {

  angular
  .module('planApp')
  .controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$location', 'authentication'];
  function loginCtrl($location, authentication) {
    var vm = this;

    vm.accessData = {
      email : "",
      password : ""
    };

    vm.onSubmit = function () {
      authentication
        .login(vm.accessData)
        .error(function(err){
          alert("Email o password errata");
        })
        .then(function(){
          $location.path('profile');
        });
    };

  }

})();