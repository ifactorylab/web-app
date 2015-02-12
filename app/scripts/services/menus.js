'use strict';

/**
 * @ngdoc service
 * @name webApp.menus
 * @description
 * # menus
 * Factory in the webApp.
 */
angular.module('webApp')
  .factory('Menus', function (Restangular, $q) {
    // var menus = Restangular.setBaseUrl('http://localhost/api/');
    var api = Restangular.setBaseUrl('');
    api.getMenu = function(menuId) {
      var def = $q.defer();
      this.one('menus/site').getList(menuId + '.json').then(function(data) {
        def.resolve(data);
      });
      return def.promise;
    };
    // Public API here
    return api;
  });
