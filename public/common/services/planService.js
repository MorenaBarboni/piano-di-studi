(function() {
  angular.module("planApp").service("planService", planService);

  planService.$inject = ["$http", "$location", "authentication", "$q"];

  function planService($http, $location, authentication, $q) {
    registerCourse = function(plan) {
      return $http.post("/api/plan", plan);
    };

    getPlan = function() {
      return $http
        .get("/api/plan", {
          headers: {
            Authorization: "Bearer " + authentication.getToken()
          }
        })
        .then(handleSuccess, handleError);
    };

    deleteCourse = function(courseId) {
      return $http
        .delete("/api/plan/" + courseId)
        .success(function(data, status) {
          console.log(data);
        });
    };

    //funzioni private
    function handleSuccess(res) {
      return res.data;
    }

    function handleError(res) {
      return $q.reject(res.data);
    }

    return {
      registerCourse: registerCourse,
      getPlan: getPlan,
      deleteCourse: deleteCourse
    };
  }
})();
