'use strict';

/**
 * @ngdoc service
 * @name webApp.locations
 * @description
 * # locations
 * Factory in the webApp.
 */
angular.module('webApp')
  .factory('Locations', function (Restangular, $q) {
    var api = Restangular.setBaseUrl('');
    api.getLocation = function (locationId) {
      var def = $q.defer();
      this.one('locations/site').getList(locationId + '.json').then(function(data) {
        def.resolve(data);
      });
      return def.promise;
    };

    // Public API here
    return api;
  });
