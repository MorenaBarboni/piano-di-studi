(function () {

  angular
    .module('planApp')
    .service('userService', userService);

  userService.$inject = ['$http', 'authentication'];
  function userService($http, authentication) {

    var getProfile = function () {
      return $http.get('/api/profile', {
        headers: {
          Authorization: 'Bearer ' + authentication.getToken()
        }
      });
    };

    return {
      getProfile: getProfile
    };
  }

})();