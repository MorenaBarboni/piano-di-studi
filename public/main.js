(function() {
  angular.module("planApp", ["ngRoute", "ng-fusioncharts"]);

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
      .when("/career", {
        templateUrl: "/career/career.view.html",
        controller: "careerCtrl",
        controllerAs: "vm"
      })
      .when("/examBooking", {
        templateUrl: "/exam_booking/examBooking.view.html",
        controller: "bookingCtrl",
        controllerAs: "vm"
      })
      .when("/examSession", {
        templateUrl: "/exam_session/examSession.view.html",
        controller: "examSessionCtrl",
        controllerAs: "vm"
      })
      .when("/examSession/validation/:sessionId", {
        templateUrl: "/exam_session/validation.view.html",
        controller: "validationCtrl",
        controllerAs: "vm"
      })
      .when("/usersManagement", {
        templateUrl: "/usersManagement/usersManagement.view.html",
        controller: "usersManagementCtrl",
        controllerAs: "vm"
      })
      .when("/thesis", {
        templateUrl: "/thesis/thesis.view.html",
        controller: "thesisCtrl",
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
      if ($location.path() === "/profile" && !authentication.isLoggedIn()) {
        $location.path("/");
      } else if (
        $location.path() === "/plan" &&
        (!authentication.isLoggedIn() || !authentication.isAdmin())
      ) {
        $location.path("/");
      } else if ($location.path() === "/login" && authentication.isLoggedIn()) {
        $location.path("/");
      } else if (
        $location.path() === "/register" &&
        !authentication.isAdmin()
      ) {
        $location.path("/");
      } else if (
        $location.path() === "/career" &&
        (!authentication.isLoggedIn() || !authentication.isStudente())
      ) {
        $location.path("/");
      } else if (
        $location.path() === "/examBooking" &&
        !authentication.isStudente()
      ) {
        $location.path("/");
      } else if (
        $location.path() === "/examSession" &&
        !authentication.isDocente()
      ) {
        $location.path("/");
      } else if (
        $location.path() === "/examSession/validation/:sessionId" &&
        !authentication.isDocente()
      ) {
        $location.path("/");
      } else if (
        $location.path() === "/thesis" &&
        (!authentication.isLoggedIn() || authentication.isAdmin())
      ) {
        $location.path("/");
      } else if (
        $location.path() === "/usersManagement" &&
        (!authentication.isLoggedIn() || !authentication.isAdmin())
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
