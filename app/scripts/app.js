'use strict';

/**
 * @ngdoc overview
 * @name webApp
 * @description
 * # webApp
 *
 * Main module of the application.
 */
angular
  .module('webApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'restangular',
    'angularLocalStorage'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/:appId/show-cart', {
        templateUrl: 'views/show-cart-view.tpl.html',
        controller: 'ShowCartCtrl'
      })
      .when('/:appId/checkout', {
        templateUrl: 'views/checkout-view.tpl.html',
        controller: 'CheckoutCtrl'
      })
      .when('/:appId', {
        templateUrl: 'views/welcome.tpl.html',
        controller: 'WelcomeCtrl',
        resolve: {
          layout: function($q, $route, Layouts) {
            var appId = $route.current.params.appId;
            return Layouts.getLayout(appId);
          },
          menu: function($q, $route, Menus) {
            var appId = $route.current.params.appId;
            return Menus.getMenu(appId);
          },
          location: function($q, $route, Locations) {
            var appId = $route.current.params.appId;
            return Locations.getLocation(appId);
          }
        }
      })
      .otherwise({
        redirectTo: '/1'
      });
  });
