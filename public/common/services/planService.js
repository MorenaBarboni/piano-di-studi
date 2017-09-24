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

    //Ottiene informazioni sulla tesi del piano di studi
    getPlanThesis = function(faculty, entryYear) {
      return $http
        .get("/api/plan/thesis/" + faculty + "/" + entryYear, {
          headers: {
            Authorization: "Bearer " + authentication.getToken()
          }
        })
        .then(handleSuccess, handleError);
    };

    //Ottiene informazioni sulle tesi di tutti i piani
    getAllPlanThesis = function() {
      return $http
        .get("/api/plan/allThesis", {
          headers: {
            Authorization: "Bearer " + authentication.getToken()
          }
        })
        .then(handleSuccess, handleError);
    };

    //Modifica l'obbligatorietà di un corso
    editCourseMandatory = function(courseId, mandatory) {
      console.log("SErvice:" +mandatory)
      return $http
        .put("/api/plan/course/" + courseId + "/mandatory/" + mandatory)
        .then(function(res) {
          return res.data;
        });
    };
    //Modifica i cfu di un corso
    editCourseCfu = function(courseId, cfu) {
      console.log("SErvice:" +cfu)
      return $http
        .put("/api/plan/course/" + courseId + "/cfu/" + cfu)
        .then(function(res) {
          return res.data;
        });
    };
    //Modifica il semestre di un corso
    editCourseSemester = function(courseId, semester) {
      console.log("SErvice:" +semester)
      return $http
        .put("/api/plan/course/" + courseId + "/semester/" + semester)
        .then(function(res) {
          return res.data;
        });
    };
    //Modifica il docente che tiene un corso
    editCourseProfessor = function(courseId, professorEmail) {
      console.log("SErvice:" +professorEmail + " id " +courseId)
      return $http
        .put("/api/plan/course/" + courseId + "/professor/" + professorEmail)
        .then(function(res) {
          return res.data;
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
      deleteCourse: deleteCourse,
      getStudentPlan: getStudentPlan,
      getProfessorCoursesInfo: getProfessorCoursesInfo,
      getProfessorCourses: getProfessorCourses,
      getPlanThesis: getPlanThesis,
      getAllPlanThesis: getAllPlanThesis,
      editCourseMandatory: editCourseMandatory,
      editCourseCfu: editCourseCfu,
      editCourseSemester: editCourseSemester,
      editCourseProfessor: editCourseProfessor
    };
  }
})();
