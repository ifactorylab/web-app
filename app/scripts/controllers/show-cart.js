'use strict';

angular.module('webApp')
  .controller('ShowCartCtrl', ['$scope',
                              '$location',
                              '$window',
                              '$http',
                              'menusService',
                              'storage',
  function($scope, $location, $window, $http, menusService, storage) {
    $scope.shoppingCart = storage.get('shoppingCart');

    $scope.getTotalPrice = function(items) {
      var totalPrice = 0.0;
      angular.forEach(items, function(item, key) {
        item.price = parseInt(item.quantity) * parseFloat(item.item.price);
        totalPrice += parseFloat(item.price);
      });
      return totalPrice;
    };

    $scope.getTotalQuantity = function(items) {
      var totalQuantity = 0;
      angular.forEach(items, function(item, key) {
        totalQuantity += parseInt(item.quantity);
      });
      return totalQuantity;
    };

    $scope.updateShoppingCart = function(shoppingCart) {
      shoppingCart.totalPrice = $scope.getTotalPrice(shoppingCart.items);
      shoppingCart.quantity = $scope.getTotalQuantity(shoppingCart.items);
      storage.set('shoppingCart', shoppingCart);
    }

    $scope.removeItem = function(item) {
      delete $scope.shoppingCart.items[item.item.$$hashKey];
      $scope.updateShoppingCart($scope.shoppingCart);
    };

    $scope.checkout = function() {
      $location.path('checkout');
    };
  }])
  .directive('editableContent', function() {
    return {
      restrict: 'A', // only activate on element attribute
      require: '?ngModel', // get a hold of NgModelController
      link: function(scope, element, attrs, ngModel) {
        if (!ngModel) {
          return; // do nothing if no ng-model
        }

        // Specify how UI should be updated
        ngModel.$render = function() {
          element.html(ngModel.$viewValue || '');
        };

        // Listen for change events to enable binding
        element.on('blur keyup change', function() {
          var quantity = parseInt(ngModel.$viewValue);
          if (quantity >= 0) {
            scope.item.quantity = quantity;
            scope.updateShoppingCart(scope.shoppingCart);
          } else {
            ngModel.$viewValue = 0;
            ngModel.$setViewValue(0);
          }
          scope.$apply();
        });
      }
    };
  });