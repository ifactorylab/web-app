'use strict';

angular.module('ifLayouts', [
])
  .factory('layouts', ['Restangular',
    function(Restangular) {
      var layouts = Restangular.setBaseUrl('');
      layouts.get = function(layoutId) {
        return this.one('layouts', layoutId + '.json').get();
      };
      return layouts;
    }
  ]);