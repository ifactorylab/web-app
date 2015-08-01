'use strict';

/**
 * @ngdoc directive
 * @name webApp.directive:parallax
 * @description
 * # parallax
 */
angular.module('webApp')
  .directive('parallaxBackground', function($window) {
    return function(scope, element, attrs) {
      scope.$$parllaxBackgrounds[attrs.urlId] = element;
      scope.region = function(item) {
        return { 'x': item.offset().left,
                 'y': item.offset().top,
                 'width': item.width(),
                 'height': item.height() };
      };

      scope.viewPort = function() {
        var w = angular.element($window);
        return { 'x': $window.pageXOffset,
                 'y': $window.pageYOffset,
                 'width': w.width(),
                 'height': w.height() };
      };

      scope.inRegion = function(r) {
        var v = scope.viewPort();
        if ((v.y + v.height <= r.y) || (v.y >= r.y + r.height)) {
          return false;
        }
        return ((v.x <= r.x && v.x + v.width <= r.x + r.width) ||
                (v.x > r.x && v.x + v.width > r.x + r.width)) &&
                ((v.y < r.y + r.height && v.y + v.height > r.y + r.height) ||
                 (v.y <= r.y && v.y + v.height <= r.y + r.height) ||
                 (v.y > r.y && v.y + v.height < r.y + r.height));
      };

      var w = angular.element($window);
      scope.syncParallaxBackground = function(itemId) {
        var offset = $window.pageYOffset;
        var background = scope.$$parllaxBackgrounds[itemId];
        if (scope.$$parllaxItems) {
          var pi = scope.$$parllaxItems[itemId].el;
          if (pi) {
            if (scope.inRegion(scope.region(pi))) {
              offset = parseInt(pi.offset().top - offset, 10);
            } else {
              offset = -9000;
            }
          }
        }
        if (background) {
          background.css({
            '-webkit-transform': 'translate3d(0, ' + offset + 'px, 0)',
            overflow: 'hidden'
          });
        }
      };
      w.bind('scroll', function() {
        scope.syncParallaxBackground(attrs.urlId);
      });
    };
  })
  .directive('parallax', function($window, $timeout) {
    return function(scope, element, attrs) {
      var w = angular.element($window);
      var PARALLAX_IMAGE_RATIO = 2 / 3;
      var MIN_WIDTH = 320;

      scope.renderParallaxImage = function(factor, window, element, attrs) {
        var itemId = element.parent().attr('data-url-id');
        var offset = $window.pageYOffset;
        if (scope.$$parllaxItems[itemId]) {
          var pi = scope.$$parllaxItems[itemId].el;
          offset -= pi.offset().top;
          element.css({
            '-webkit-transform': 'translate3d(0, ' + parseInt(offset * factor, 10) + 'px, 0)',
            position: 'relative'
          });
        } else {
          scope.$$parllaxImages[itemId] = element;
        }
      };

      scope.ratioAspectToFit = function(ratio, window, element) {
        var width = window.width();
        var height = parseInt(width * ratio);
        var left = 0;

        if (height < window.height()) {
          // Width is decided by height now
          height = window.height();
          width = parseInt(height / ratio);
          left = (width - window.width()) / 2;
        }

        if (window.width() < MIN_WIDTH) {
          if (height * ratio <= window.width()) {
            return;
          }
        }

        var top = (height - window.height()) / 2;
        element.css({
          top: (top * -1),
          height: height,
          width: width,
          left: parseInt(left * -1)
        });
      };

      var allContentLoaded = function() {
        scope.renderParallaxImage(scope.PARALLAX_FACTOR, w, element, attrs);
        scope.ratioAspectToFit(PARALLAX_IMAGE_RATIO, w, element);
      };

      $timeout(allContentLoaded, 200);

      w.bind('scroll', function() {
        scope.renderParallaxImage(scope.PARALLAX_FACTOR, w, element, attrs);
      });
      w.bind('resize', function () {
        scope.ratioAspectToFit(PARALLAX_IMAGE_RATIO, w, element);
      });
    };
  })
  .directive('parallaxNav', function() {
    return function(scope, element) {
      scope.$$parallaxNav = element;
    };
  })
  .directive('parallaxItem', function($window, $location) {
    return function(scope, element, attrs) {
      var index = Object.keys(scope.$$parllaxItems).length;
      scope.$$parllaxItems[attrs.urlId] = { 'el': element, 'id': index };
      scope.syncParallaxBackground(attrs.urlId);
      scope.renderParallaxImage(scope.PARALLAX_FACTOR,
                                angular.element($window),
                                element);
      if (!scope.$$isInHashRegion) {
        var hash = $location.hash();
        if (hash === attrs.urlId) {
          var offset = parseInt(element.offset().top) + 1;
          if (index === 0) {
            offset -= $('#header').height();
          }
          scope.scrollTo(offset, hash);
          scope.$$isInHashRegion = true;
        }
      }
      /*
      var w = angular.element($window);
      w.bind('redraw', function() {
        if (!scope.$$isInHashRegion) {
          var hash = $location.hash();
          if (hash === attrs.urlId) {
            var offset = parseInt(element.offset().top) + 1;
            if (index === 0) {
              offset -= $('#header').height();
            }
            scope.scrollTo(offset, hash);
            scope.$$isInHashRegion = true;
          }
        }
      });
*/
    };
  });
