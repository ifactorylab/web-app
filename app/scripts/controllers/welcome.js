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
                              '$rootScope',
                              'menusService',
                              'storage',
                              'layout',/*
                              'menu',
                              'location',*/
  function($scope, $location, $window, $http, $timeout, $routeParams, $rootScope, menusService, storage, layout/*, menu, location*/) {
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
    $scope.site = layout.site;
    $scope.pages = layout.site.pages;
    $scope.style = layout.site.style;
    $scope.categories = layout.site.products;
    var business = layout.site.business;
    var hoursMap = {};

    console.log($scope.site);
    $rootScope.metatags = {
      title: $scope.site.name,
      description: $scope.site.description.join(""),
      robots: "index, follow",
      keywords: $scope.site.keywords
    };

    $scope.capitalize = function(s) {
      return s[0].toUpperCase() + s.slice(1);
    }

    if (business.hours) {
      var hours = business.hours;
      var days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
      for (var i = 0; i < days.length; i++) {
        var obj = hours[days[i]];
        for (var k in obj) {
          if (!hoursMap[obj[k].text]) {
            hoursMap[obj[k].text] = [];
          }
          hoursMap[obj[k].text].push(obj[k].day);
        }
      }

      $scope.hours = [];

      for (var k in hoursMap) {
        var days = hoursMap[k];
        var first = days[0];
        var last = days[days.length - 1];
        $scope.hours.push({ "day": $scope.capitalize(first) + " - " + $scope.capitalize(last),
                            "hour": k });
      }
    }

    $scope.locations = [business];
    // $scope.categories = menu;

    $scope.appId = $routeParams.appId;
    $scope.shoppingCartKey = 'shoppingCart-appId-' + $scope.appId;
    $scope.shoppingCart = storage.get($scope.shoppingCartKey);

    if (typeof $scope.shoppingCart !== 'object' || !$scope.shoppingCart) {
      $scope.shoppingCart = {'quantity': 0, 'items': {}, 'totalPrice': 0.0};
    }

    var allContentLoaded = function() {
      angular.element($window).trigger('redraw');
    };

    $timeout(allContentLoaded, 100);

    angular.element($window).bind('update_cart', function() {
      $scope.shoppingCart = menusService.getShoppingCart();
    });

    $scope.showCart = function(items) {
      $location.hash('');
      $location.path($scope.appId + '/show-cart');
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

    $scope.openMenuViewerModal = function(menu) {
      $scope.openModal();
      $scope.selectedMenu = menu;
      $scope.showMenuViewerModal = true;
    };

    $scope.closeMenuViewerModal = function() {
      $scope.closeModal();
      $scope.showMenuViewerModal = false;
    };

    $scope.openPhotoViewerModal = function() {
      $scope.openModal();
      $scope.showPhotoViewerModal = true;
    };

    $scope.closePhotoViewerModal = function() {
      $scope.closeModal();
      $scope.showPhotoViewerModal = false;
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
  });

