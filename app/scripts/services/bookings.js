'use strict';

/**
 * @ngdoc service
 * @name webApp.bookings
 * @description
 * # bookings
 * Factory in the webApp.
 */
angular.module('webApp')
  .service('bookingApi', function (Restangular, $q) {
    var api = Restangular.setBaseUrl('http://service-site.herokuapp.com');

    api.request = function(siteId, booking) {
      var def = $q.defer();
      this.one('sites', siteId).post('booking', { booking: booking }).then(function(data) {
        def.resolve(data);
      });
      return def.promise;
    };

    // Public API here
    return api;
  });
