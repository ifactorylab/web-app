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
  .config(function ($routeProvider, $locationProvider, $windowProvider) {
    $locationProvider.html5Mode(true);
    // $locationProvider.hashPrefix('!');

    var appId = $windowProvider.$get().appId;

    $routeProvider
    /*
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
          layout: function($route, Layouts) {
            var appId = $route.current.params.appId;
            return Layouts.getLayout(appId);
          }
        }
      })
*/
      .when('/', {
        templateUrl: 'views/welcome.tpl.html',
        controller: 'WelcomeCtrl',
        resolve: {
          layout: function($route, Layouts) {
            return Layouts.getLayout(appId);
          }
        }
      })
      .otherwise({
        templateUrl: 'views/welcome.tpl.html',
        controller: 'WelcomeCtrl',
        resolve: {
          layout: function($route, Layouts) {
            return Layouts.getLayout(appId);
          }
        }
      });
  });
