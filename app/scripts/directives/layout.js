'use strict';

/**
 * @ngdoc directive
 * @name webApp.directive:layout
 * @description
 * # layout
 */
angular.module('webApp')
  .directive('layoutCenter', function($window) {
    return function(scope, element) {
      var w = angular.element($window);
      scope.alignCenter = function(window, element) {
        element.css({
          top: '50%',
          left: '50%',
          marginTop: element[0].offsetHeight * -0.5,
          marginLeft: element[0].offsetWidth * -0.5
        });
      };

      scope.alignCenter(w, element);
      w.bind('resize', function () {
        scope.alignCenter(w, element);
      });
      w.bind('redraw', function () {
        scope.alignCenter(w, element);
      });
    };
  })
  .directive('layoutFill', function($window) {
    return function(scope, element, attrs) {
      var w = angular.element($window);
      scope._getLightness = function(hexcolor) {
        if (hexcolor && hexcolor.length > 0 && hexcolor.length <= 7) {
          hexcolor = hexcolor.replace('#', '');
          return ((parseInt(hexcolor, 16) > 0xffffff/2) ? 'light' : 'dark');
        } else {
          return '';
        }
      };

      scope.updateNavigatorColor = function(color) {
        var lightness = scope._getLightness(color);
        $('body').removeClass('color-weight-dark').removeClass('color-weight-light').addClass('color-weight-' + lightness);
      };

      scope.scaleToFill = function(window, scaleFactor, element) {
        element.css({
          height: parseInt(window.height() * scaleFactor, 10)
        });
      };

      scope.scaleToFill(w, attrs.layoutFill, element);
      w.bind('resize', function () {
        scope.scaleToFill(w, attrs.layoutFill, element);
      });
      w.bind('scroll', function () {
        if (scope.detectScroll) {
          if (element.offset().top > 0 && element.data('color-suggested')) {
            var viewPort = scope.viewPort();
            var half = viewPort.y + (viewPort.height / 2);
            if (element.offset().top <= half &&
                element.offset().top + element.height() >= half) {
              scope.updateNavigatorColor(element.data('color-suggested'));
            }
          }
        }
      });
    };
  })
  .directive('layoutFullscreen', function($window) {
    return function(scope, element, attrs) {
      var w = angular.element($window);
      scope.scaleToFill = function(window, scaleFactor, element) {
        element.css({
          top: $window.pageYOffset,
          height: parseInt(window.height() * scaleFactor, 10),
        });
      };
      scope.scaleToFill(w, 1, element);
      w.bind('resize', function() {
        scope.scaleToFill(w, 1, element);
      });
      w.bind('redraw', function() {
        scope.scaleToFill(w, 1, element);
      });
    };
  });
