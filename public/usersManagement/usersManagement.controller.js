(function() {
  angular
    .module("planApp")
    .controller("usersManagementCtrl", usersManagementCtrl);
  usersManagementCtrl.$inject = [
    "$location",  "userService", "$http", "$window", "$scope", "$window", "authentication" ];
  function usersManagementCtrl( $location, userService, $http, $window, $scope, $location, authentication ) {
    var vm = this;

    vm.user = {}; //Utente corrente

    vm.contacts = {}; //conatti per il footer

    vm.users = []; //Elenco di tutti gli utenti

    //Filtri utente
    vm.filter = {
      filterName: "",
      filterMat: "",
      filterType: "studente",
      filterFaculty: "Informatica"
    };

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
    
    //Determina quali righe della tabella filtrare
    vm.checkCorrespondence = function(name, mat, userType, faculty) {
      vm.filter.filterFaculty =
        vm.filter.filterFaculty.charAt(0).toUpperCase() +
        vm.filter.filterFaculty.slice(1);
      vm.filter.filterType =
        vm.filter.filterType.charAt(0).toLowerCase() +
        vm.filter.filterType.slice(1);
      if (
        name.indexOf(vm.filter.filterName) !== -1 &&
        mat.indexOf(vm.filter.filterMat) !== -1 &&
        userType.indexOf(vm.filter.filterType) !== -1 &&
        faculty.indexOf(vm.filter.filterFaculty) !== -1
      ) {
        return true;
      }
      return false;
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

    //registra un nuovo utente
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
