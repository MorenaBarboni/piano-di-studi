(function() {
  angular.module("planApp", ["ngRoute"]);

  function config($routeProvider, $locationProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "home/home.view.html",
        controller: "homeCtrl",
        controllerAs: "vm"
      })
      .when("/register", {
        templateUrl: "/auth/register/register.view.html",
        controller: "registerCtrl",
        controllerAs: "vm"
      })
      .when("/login", {
        templateUrl: "/auth/login/login.view.html",
        controller: "loginCtrl",
        controllerAs: "vm"
      })
      .when("/profile", {
        templateUrl: "/profile/profile.view.html",
        controller: "profileCtrl",
        controllerAs: "vm"
      })
      .when("/plan", {
        templateUrl: "/plan/plan.view.html",
        controller: "planCtrl",
        controllerAs: "vm"
      })
      .when("/logout", {
        resolve: {
          logout: [
            "logoutService",
            function(logoutService) {
              logoutService();
            }
          ]
        },
        redirectTo: "/"
      })
      .otherwise({ redirectTo: "/" });

    $locationProvider.html5Mode(true);
  }

  function run($rootScope, $location, authentication) {
    $rootScope.$on("$routeChangeStart", function(
      event,
      nextRoute,
      currentRoute
    ) {
      //Quando un utente è loggato non deve accedere al login
      if ($location.path() === "/profile" && !authentication.isLoggedIn()) {
        $location.path("/");
      } else if (
        $location.path() === "/plan" &&
        (!authentication.isLoggedIn() || !authentication.isAdmin())
      ) {
        $location.path("/");
      } else if (
        $location.path() === "/login" &&
        authentication.isLoggedIn() 
      ) {
        $location.path("/");
      } else if (
        $location.path() === "/register" &&
        !authentication.isAdmin()
      ) {
        $location.path("/");
      }
    });
  }

  angular
    .module("planApp")
    .config(["$routeProvider", "$locationProvider", config])
    .run(["$rootScope", "$location", "authentication", run]);
})();
