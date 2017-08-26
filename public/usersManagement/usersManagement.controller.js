(function() {
  angular
    .module("planApp")
    .controller("usersManagementCtrl", usersManagementCtrl);
  usersManagementCtrl.$inject = [
    "$location",
    "userService",
    "$http",
    "$window",
    "$scope",
    "$window"
  ];
  function usersManagementCtrl(
    $location,
    userService,
    $http,
    $window,
    $scope,
    $location
  ) {
    var vm = this;

    vm.user = {}; //Utente corrente

    vm.users = []; //Elenco di tutti gli utenti


    //Filtri utente
    vm.filter = {
      filterName: "",
      filterMat: "",
      filterType: "",
      filterEmail: ""
    };

    //Determina quali righe della tabella filtrare
    vm.checkCorrespondence = function(name, mat, userType, email) {
      if (
        name.indexOf(vm.filter.filterName) !== -1 &&
        mat.indexOf(vm.filter.filterMat) !== -1 &&
        userType.indexOf(vm.filter.filterType) !== -1 &&
        email.indexOf(vm.filter.filterEmail) !== -1
      ) {
        return true;
      }
      return false;
    };

    initController();

    function initController() {
      userService
        .getProfile()
        .success(function(data) {
          vm.user = data;
        })
        .error(function(e) {
          console.log(e);
        });

      //Ottiene l'elenco degli utenti
      userService.getAllUsers().then(function(users) {
        vm.users = users;
      });
    }

    $scope.deleteUser = function(id) {
      if (id === vm.user._id) {
        if (confirm("Vuoi davvero eliminare il tuo account?") == true) {
          userService.deleteUser(id);
          alert("Il tuo account è stato eliminato con successo!");
          $window.location.href = "logout";
        }
      } else {
        if (confirm("Vuoi davvero eliminare l'utente?") == true) {
          userService.deleteUser(id);
          alert("Utente eliminato con successo!");
          $window.location.reload();
        }
      }
    };
  }
})();
