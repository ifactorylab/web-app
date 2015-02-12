'use strict';

/**
 * @ngdoc service
 * @name webApp.layouts
 * @description
 * # layouts
 * Factory in the webApp.
 */
angular.module('webApp')
  .factory('Layouts', function (Restangular, $q) {
    var api = Restangular.setBaseUrl('');
    api.getLayout = function(layoutId) {
      var def = $q.defer();
      this.one('layouts', layoutId + '.json').get().then(function(data) {
        def.resolve(data);
      });
      return def.promise;
    };

    // Public API here
    return api;
  });
