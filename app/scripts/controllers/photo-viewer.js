'use strict';

angular.module('webApp')
  .controller('PhotoViewerCtrl', function($scope, $location) {
  	console.log("PhotoViewerCtrl initialized!!!");
  })
  .directive('photoViewerModal', function($window) {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'views/photo-viewer.tpl.html',
      link: function(scope, element, attrs) {

      }
    };
  });