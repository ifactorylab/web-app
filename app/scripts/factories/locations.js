'use strict';

angular.module('ifLocations', [
])
  .factory('locations', ['Restangular',
    function(Restangular) {
      // var locations = Restangular.setBaseUrl('http://localhost/api/');
      var locations = Restangular.setBaseUrl('');
      locations.list = function(locationId) {
        return this.one('locations/site').getList(locationId + '.json');
      };
      return locations;
    }
  ]);