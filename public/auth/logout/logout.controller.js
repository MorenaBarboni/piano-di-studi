(function () {

    angular
        .module('planApp')
        .controller('logoutCtrl', logoutCtrl);

    logoutCtrl.$inject = ['logoutService'];
    function logoutCtrl(logoutService) {
        logoutService
            .logout()
    }

})();