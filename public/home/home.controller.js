(function() {
  angular.module("planApp").controller("homeCtrl", homeCtrl);

  homeCtrl.$inject = ["$location", "userService", "$scope"];
  function homeCtrl($location, userService, $scope) {
    var vm = this;

    vm.user = [];

    //email degli admin per il footer
    vm.contacts = {};

    var cities = [
      {
        city:  "Polo di Informatica",
        desc: "",
        lat: 43.1395461,
        long: 13.0687677
      },
      {
        city: "Polo di Fisica",
        desc: "",
        lat: 43.139528,
        long: 13.0677438
      },
      {
        city:"Polo di Chimica",
        desc: "",
        lat: 43.13869427,
        long: 13.06986541
      }
    ];

    var mapOptions = {
      zoom: 16,
      center: new google.maps.LatLng(43.139528, 13.0677438),
      mapTypeId: google.maps.MapTypeId.SATELLITE
    };

    $scope.map = new google.maps.Map(
      document.getElementById("map"),
      mapOptions
    );

    $scope.markers = [];

    var infoWindow = new google.maps.InfoWindow();

    var createMarker = function(info) {
      var marker = new google.maps.Marker({
        map: $scope.map,
        position: new google.maps.LatLng(info.lat, info.long),
        title: info.city
      });
      marker.content = '<div class="infoWindowContent">' + info.desc + "</div>";

      google.maps.event.addListener(marker, "click", function() {
        infoWindow.setContent("<h2>" + marker.title + "</h2>" + marker.content);
        infoWindow.open($scope.map, marker);
      });

      $scope.markers.push(marker);
    };

    for (i = 0; i < cities.length; i++) {
      createMarker(cities[i]);
    }

    $scope.openInfoWindow = function(e, selectedMarker) {
      e.preventDefault();
      google.maps.event.trigger(selectedMarker, "click");
    };

    initController(); //Inizializza il controller

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
    }
  }
})();