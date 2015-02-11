'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:WelcomeCtrl
 * @description
 * # WelcomeCtrl
 * Controller of the webApp
 */
angular.module('webApp')
  .controller('WelcomeCtrl', ['$scope',
                              '$location',
                              '$window',
                              '$http',
                              '$timeout',
                              '$routeParams',
                              'menusService',
                              'storage',
                              'layout',
                              'menu',
                              'location',
  function($scope, $location, $window, $http, $timeout, $routeParams, menusService, storage, layout, menu, location) {
    $scope.PARALLAX_FACTOR = 0.8;
    $scope.$$parllaxBackgrounds = {};
    $scope.$$parllaxItems = {};
    $scope.$$parllaxImages = {};
    $scope.$$hashNavigators = {};
    $scope.$$layouts = {};
    $scope.$$isDefaultHashSet = false;
    $scope.$$isInHashRegion = false;
    $scope.$$parallaxNav = null;
    $scope.detectScroll = true;
    $scope.showPhotoViewerModal = false;
    $scope.showMenuViewerModal = false;
    $scope.selectedMenu = null;
    $scope.shoppingCart = storage.get('shoppingCart');
    $scope.attributes = layout.structure;
    $scope.categories = menu;
    $scope.locations = location;

    if (typeof $scope.shoppingCart !== 'object' || !$scope.shoppingCart) {
      $scope.shoppingCart = {'quantity': 0, 'items': {}, 'totalPrice': 0.0};
    }

    var allContentLoaded = function() {
      angular.element($window).trigger('redraw');
    };

    $timeout(allContentLoaded, 100);

    // console.log('WelcomeCtrl initialized!!!');
    // angular.element($window).trigger('resize');
    // console.log($scope.test);
    /*
    menus.list("1").then(function(menus) {
      $scope.categories = menus;
    });
*/
/*
    layouts.get("1").then(function(layout) {
      // console.log($scope.attributes);
      // angular.element($window).trigger('resize');
    });
  */
    angular.element($window).bind('update_cart', function() {
      $scope.shoppingCart = menusService.getShoppingCart();
    });

    $scope.showCart = function(items) {
      $location.hash('');
      $location.path('show-cart');
    };

    $scope.enableScroll = function(enable) {
      $('body').css({
        'overflow-y': enable ? 'auto' : 'hidden',
        'overflow-x': enable ? 'auto' : 'hidden',
      });
    };

    $scope.enableScroll(true);

    $scope.openModal = function() {
      $scope.detectScroll = false;
      angular.element($window).trigger('redraw');
      $scope.enableScroll(false);
    };

    $scope.closeModal = function() {
      $scope.detectScroll = true;
      $scope.enableScroll(true);
    };

    $scope.closePhotoViewerModal = function() {
      $scope.closeModal();
      $scope.showPhotoViewerModal = false;
    };

    $scope.closeMenuViewerModal = function() {
      $scope.closeModal();
      $scope.showMenuViewerModal = false;
    };

    $scope.openMenuViewerModal = function(menu) {
      $scope.openModal();
      $scope.selectedMenu = menu;
      $scope.showMenuViewerModal = true;
    };

    $scope.openPhotoViewerModal = function() {
      $scope.openModal();
      $scope.showPhotoViewerModal = true;
    };

    $scope.scrollTo = function(offset, hash) {
      if ($location.hash() !== hash) {
        // $location.hash(hash);
      } else {
        // While moving, don't detect scroll
        $scope.detectScroll = false;
        $('html,body').animate({
          scrollTop: offset + 'px'
        }, 'slow', 'linear', function() {
          $scope.detectScroll = true;
        });
      }
    };

    // $scope.navigateTo = function($event) {
    $scope.navigateTo = function(name) {
      // var target = $($event.currentTarget);
      // var name = target.attr('hash-navigator');
      if ($scope.$$parllaxItems[name]) {
        var pi = $scope.$$parllaxItems[name].el;
        if (pi) {
          var index = $scope.$$parllaxItems[name].id;
          var offset = parseInt(pi.offset().top) + 1;
          if (index === 0) {
            offset -= $('#header').height();
          }
          $scope.scrollTo(offset, name);
        }
      }
    };
    // $scope.isLayoutReady = true;
  }])
  .directive('hashNavigator', function($window, $location) {
    return function(scope, element, attrs) {
      var w = angular.element($window);
      var itemId = attrs.hashNavigator;
      scope.$$hashNavigators[itemId] = $(element);

      if (!scope.$$isDefaultHashSet) {
        scope.$$isDefaultHashSet = true;
        var hash = $location.hash();
        if (hash === '') {
          // $location.hash(itemId);
        }
      }

      scope.inViewPort = function(top, height) {
        var offset = $window.pageYOffset;
        return (offset > top && top + height > offset);
      };

      scope.activeNavigator = function(itemId) {
        if (scope.$$parllaxItems[itemId]) {
          var pi = scope.$$parllaxItems[itemId].el;
          if (pi) {
            var element = scope.$$hashNavigators[itemId];
            var index = scope.$$parllaxItems[itemId].id;
            var top = parseInt(pi.offset().top);
            if (index === 0) {
              top -= $('#header').height() + 1;
            }
            if (scope.inViewPort(top, pi.height())) {
              element.addClass('active');
            } else {
              element.removeClass('active');
            }
          }
        }
      };

      scope.activeNavigator(itemId);
      w.bind('scroll', function () {
        if (scope.detectScroll) {
          scope.activeNavigator(itemId);
        }
      });
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
  })
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
  .directive('parallax', function($window) {
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

        if (window.width() <= MIN_WIDTH) {
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
      scope.renderParallaxImage(scope.PARALLAX_FACTOR, w, element, attrs);
      scope.ratioAspectToFit(PARALLAX_IMAGE_RATIO, w, element);

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
  .directive('hashItem', function($window, $location) {
    return function(scope, element, attrs) {
      var w = angular.element($window);
      scope.updateHashItem = function(window, element, attrs) {
        var itemId = attrs.urlId;
        if (scope.$$parllaxItems && scope.$$parllaxItems[itemId]) {
          var pi = scope.$$parllaxItems[itemId].el;
          if (pi) {
            var top = parseInt(pi.offset().top);
            if (scope.inViewPort(top, pi.height())) {
              var hash = $location.hash();
              if (hash !== '' && hash !== itemId) {
                // console.log("hash changed222!!!")
                // $location.hash(itemId);
              }
            }
          }
        }
      };

      w.bind('scroll', function () {
        if (scope.detectScroll) {
          // scope.updateHashItem(w, element, attrs);
        }
      });
    };
  })
  .directive('popupLayer', function() {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'views/popup-view.tpl.html',
      link: function() {

      }
    };
  })
  /*
  .directive('menuClassic', function($window) {
    return {
      restrict: 'CA',
      replace: true,
      templateUrl: 'views/menu.tpl.html',
      link: function() {
        var w = angular.element($window);
        w.trigger('redraw');
      }
    };
  })
  */
  /*
  .directive('menuClassicItem', function($window) {
    return function(scope, element) {
      element.css({cursor: 'pointer'});
      element.bind('click', function() {
        var w = angular.element($window);
        w.trigger('redraw');
        // scope.$$showMenuViewer = true;
        // scope.imageSrc = attrs.src;
        // scope.$apply();
      });
    };
  })
*/
  .directive('modalViewer', function() {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'views/photo-viewer.tpl.html',
      link: function(scope, element, attrs) { }
    };
  })
  .directive('menuClassicItem', function() {
    return function(scope, element) {
      element.css({cursor: 'pointer'});
      element.bind('click', function () {
        scope.openMenuViewerModal(scope.menu);
        scope.$apply();

      });
    };
  })
  .directive('photoViewer', function($window) {
    return function(scope, element, attrs) {
      element.bind('click', function() {
        scope.photoViwerImageSrc = attrs.src;
        scope.openPhotoViewerModal();
        scope.$apply();
      });
    };
  })
  .directive('ratioAspectToFit', function($window) {
    return function(scope, element, attrs) {
      var w = angular.element($window);
      var POPUP_IMAGE_RATIO = 2 / 3;
      var MIN_WIDTH = 320;

      scope.ratioAspectToFit = function(ratio, window, element) {
        var parent = element.parent();
        var width = parent.width();
        var height = parseInt(width * ratio);
        var left = 0;

        if (height > parent.height()) {
          height = parent.height();
          width = parseInt(height / ratio);
          left = parseInt((parent.width() - width) / 2);
        }

        if (parent.width() <= MIN_WIDTH) {
          if (height * ratio <= parent.width()) {
            return;
          }
        }

        var top = (height - parent.height()) / 2;
        element.css({
          'font-size': 0,
          top: (top * -1),
          height: height,
          width: width,
          left: left,
          position: 'relative'
        });
      };

      scope.ratioAspectToFit(POPUP_IMAGE_RATIO, w, element);
      w.bind('resize', function () {
        scope.ratioAspectToFit(POPUP_IMAGE_RATIO, w, element);
      });
      w.bind('redraw', function() {
        scope.ratioAspectToFit(POPUP_IMAGE_RATIO, w, element);
      });
    };
  });
