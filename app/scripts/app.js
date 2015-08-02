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
    'angularLocalStorage',
    'ui.bootstrap',
    'ui.calendar',
    'ui.utils'
  ])
  .config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/:appId/show-cart', {
        templateUrl: 'views/show-cart-view.tpl.html',
        controller: 'ShowCartCtrl'
      })
      .when('/:appId/checkout', {
        templateUrl: 'views/checkout-view.tpl.html',
        controller: 'CheckoutCtrl'
      })
      .when('/', {
        templateUrl: 'views/welcome.tpl.html',
        controller: 'WelcomeCtrl',
        resolve: {
          layout: function($route, $location, Layouts) {
            var appId = $location.search().app_id;
            return Layouts.getLayout(appId);
          }/*,
          menu: function($route, Menus) {
            var appId = $route.current.params.appId;
            return Menus.getMenu(appId);
          },
          location: function($route, Locations) {
            var appId = $route.current.params.appId;
            return Locations.getLocation(appId);
          }*/
        }
      })
      .otherwise({
        templateUrl: 'views/welcome.tpl.html',
        controller: 'WelcomeCtrl',
        resolve: {
          layout: function($route, $location, Layouts) {
            var appId = $location.search().app_id;
            return Layouts.getLayout(appId);
          }
        }
      });
  });
