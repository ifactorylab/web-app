'use strict';

angular.module('webApp')
  .controller('MenuViewerCtrl', ['$scope',
                                 '$location',
                                 'menusService',
                                 'storage',
    function($scope, $location, menusService, storage) {
      $scope.quantity = 1;

      $scope.getTotalPrice = function(items) {
        var totalPrice = 0.0;
        angular.forEach(items, function(item, key) {
          item.price = parseInt(item.quantity) * parseFloat(item.item.price);
          totalPrice += parseFloat(item.price);
        });
        return totalPrice;
      };

      $scope.setItem = function(item, quantity, items) {
        if (!items[item.$$hashKey]) {
          items[item.$$hashKey] = {'item': item, 'quantity': quantity, 'price': parseFloat(item.price)};
        } else {
          var i = items[item.$$hashKey];
          if (i) {
            i.quantity += quantity;
          }
        }
      };

      $scope.addToCart = function(item, quantity) {
        console.log(item.name + " x " + quantity + " has added to cart!!!");
        var count = parseInt(quantity);
        $scope.shoppingCart.quantity += count;
        $scope.setItem(item, count, $scope.shoppingCart.items);
        $scope.shoppingCart.totalPrice = $scope.getTotalPrice($scope.shoppingCart.items);
        menusService.updateShoppingCart($scope.shoppingCart);
        storage.set($scope.shoppingCartKey, $scope.shoppingCart);
      };
    }])
    /*
    .directive('menuClassicItem', function() {
      return function(scope, element) {
        element.css({cursor: 'pointer'});
        element.bind('click', function () {
          console.log("openMenuViewerModal clicked!!!");
        });
      };
    })
    */
    .directive('menuViewerModal', function($window) {
      return {
        restrict: 'CA',
        replace: true,
        templateUrl: 'views/menu-viewer.tpl.html',
        link: function(scope, element, attrs) {
          scope.$watch('selectedMenu', function (value) {
            scope.quantity = 1;
          }, true);
        }
      };
    });