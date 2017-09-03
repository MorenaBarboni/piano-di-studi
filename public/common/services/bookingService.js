(function() {
  angular.module("planApp").service("bookingService", bookingService);

  bookingService.$inject = ["$http", "$location", "$q", "authentication"];

  function bookingService($http, $location, $q, authentication) {

    //Carica una prenotazione
    addBooking = function(bookingData) {
      return $http.post("/api/examBooking/booking", bookingData);
    };

    //Ottiene gli appelli prenotati dallo studente
    getBookings = function(mat) {
      return $http
        .get("/api/examBooking/bookings/" + mat, {
          headers: {
            Authorization: "Bearer " + authentication.getToken()
          }
        })
        .then(handleSuccess, handleError);
    };

    //Cancella una prenotazione
    deleteBooking = function(bookingId) {
      return $http
        .delete("/api/examBooking/booking/" + bookingId)
        .success(function(data, status) {
          console.log(data);
        });
    };

    //Cancella tutte le prenotazioni quando il relativo appello viene eliminato
    deleteBookingsOfSession = function(sessionId) {
      return $http.delete("/api/examSession/bookingsOfSession/" + sessionId);
    };

    function handleSuccess(res) {
      return res.data;
    }

    function handleError(res) {
      return $q.reject(res.data);
    }

    return {
      addBooking: addBooking,
      getBookings: getBookings,
      deleteBooking: deleteBooking,
      deleteBookingsOfSession: deleteBookingsOfSession
    };
  }
})();
