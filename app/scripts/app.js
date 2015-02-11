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
    'ifMenus',
    'ifLayouts',
    'ifLocations',
    'angularLocalStorage',
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/:appId', {
        templateUrl: 'views/welcome.tpl.html',
        controller: 'WelcomeCtrl',
        resolve: {
          /*
          dependency: function($q, $rootScope) {
            var defer = $q.defer();
            var dependencies = [ 'scripts/directives/layout.js' ];
             $script(dependencies, function() {
               // all dependencies have now been loaded by $script.js so resolve the promise
               $rootScope.$apply(function() {
                 defer.resolve();
               });
            });
            return defer.promise;
          },*/
          layout: ['$q', '$route', 'layouts', function($q, $route, layouts) {
            var appId = $route.current.params.appId;
            var defer = $q.defer();
            layouts.get(appId).then(function(layout) {
              defer.resolve(layout);
            });
            return defer.promise;
          }],
          menu: ['$q', '$route', 'menus', function($q, $route, menus) {
            var appId = $route.current.params.appId;
            var defer = $q.defer();
            menus.list(appId).then(function(menu) {
              defer.resolve(menu);
            });
            return defer.promise;
          }],
          location: ['$q', '$route', 'locations', function($q, $route, locations) {
            var appId = $route.current.params.appId;
            var defer = $q.defer();
            locations.list(appId).then(function(location) {
              defer.resolve(location);
            });
            return defer.promise;
          }]
        }
      })
      .otherwise({
        redirectTo: '/1'
      });
  });
