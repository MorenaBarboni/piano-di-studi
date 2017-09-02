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

    //Ottiene il piano di studi per uno studente
    getStudentPlan = function() {
      return $http
        .get("/api/studentPlan", {
          headers: {
            Authorization: "Bearer " + authentication.getToken()
          }
        })
        .then(handleSuccess, handleError);
    };

    //Cancella un corso per Id
    deleteCourse = function(courseId) {
      return $http
        .delete("/api/plan/" + courseId)
        .success(function(data, status) {
          console.log(data);
        });
    };

    //Ottiene tutte le informazioni sui corsi tenuti da un docente
    getProfessorCoursesInfo = function(email) {
      return $http
        .get("/api/professorPlan/" + email, {
          headers: {
            Authorization: "Bearer " + authentication.getToken()
          }
        })
        .then(handleSuccess, handleError);
    };
    //Ottiene il nome dei corsi tenuti da un docente
    getProfessorCourses = function(email) {
      return $http
        .get("/api/examSession/courses/" + email, {
          headers: {
            Authorization: "Bearer " + authentication.getToken()
          }
        })
        .then(handleSuccess, handleError);
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
      deleteCourse: deleteCourse,
      getStudentPlan: getStudentPlan,
      getProfessorCoursesInfo: getProfessorCoursesInfo,
      getProfessorCourses: getProfessorCourses
    };
  }
})();
