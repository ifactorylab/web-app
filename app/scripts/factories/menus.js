'use strict';

angular.module('ifMenus', [
])
  .factory('menus', ['Restangular',
    function(Restangular) {
      // var menus = Restangular.setBaseUrl('http://localhost/api/');
      var menus = Restangular.setBaseUrl('');
      menus.list = function(menuId) {
        return this.one('menus/site').getList(menuId + '.json');
      };
      return menus;
    }
  ]);