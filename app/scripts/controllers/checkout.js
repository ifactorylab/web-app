'use strict';

angular.module('webApp')
  .controller('CheckoutCtrl', ['$scope',
                              '$location',
                              '$window',
                              '$http',
                              'menusService',
                              'storage',
  function($scope, $location, $window, $http, menusService, storage) {
    $scope.shoppingCart = storage.get('shoppingCart');
    /*
    $scope.billingInfo = { 'firstName': '',
                           'lastName': '',
                           'email': '',
                           'address1': '',
                           'address2': '',
                           'country': '',
                           'city': '',
                           'zip': '',
                           'phone': ''
                         };
                         */
    $scope.requiredFieldEmptyErrorBillingInfo = false;
    $scope.requiredFieldEmptyErrorShippingInfo = false;
    $scope.requiredFieldEmptyErrorCreditCard = false;
    $scope.completedBillingInfo = false;
    $scope.completedShippingInfo = false;
    $scope.shippingSameAsBilling = true;

    $scope.billingInfoContinue = function() {
      // First Name, Last Name, Email Address, Address Line 1, City, Zip Code required.
      if (!$scope.billingFirstName || !$scope.billingLastName ||
          !$scope.billingEmail || !$scope.billingAddress1 ||
          !$scope.billingCity || !$scope.billingZip) {
        $scope.requiredFieldEmptyErrorBillingInfo = true;
      } else {
        $scope.requiredFieldEmptyErrorBillingInfo = false;
        $scope.completedBillingInfo = true;
        $scope.completedShippingInfo = true;
      }
    };

    $scope.shippingInfoContinue = function() {
      // First Name, Last Name, Address Line 1, City, Zip Code required.
      if (!$scope.shippingFirstName || !$scope.shippingLastName ||
          !$scope.shippingAddress1 || !$scope.shippingCity ||
          !$scope.shippingZip) {
        $scope.requiredFieldEmptyErrorShippingInfo = true;
      } else {
        $scope.requiredFieldEmptyErrorShippingInfo = false;
        $scope.completedShippingInfo = true;
      }
    };

    $scope.placeOrder = function() {
      if (!$scope.cardNumber || !$scope.expMonth ||
          !$scope.expYear || !$scope.cvc) {
        $scope.requiredFieldEmptyErrorCreditCard = true;
      } else {
        // send data to the server and clear cart cache.
        storage.set('shoppingCart', '');
        $location.path('/');
        alert('order success');
      }
    };

    $scope.editBillingInfo = function() {
      $scope.completedBillingInfo = false;
    };

    $scope.editShippingInfo = function() {
      $scope.completedShippingInfo = false;
    };

    $scope.toggleShipToBilling = function() {
      $scope.shippingSameAsBilling = !$scope.shippingSameAsBilling;
      $scope.completedShippingInfo = $scope.shippingSameAsBilling;
    };

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
    };

    $scope.removeItem = function(item) {
      delete $scope.shoppingCart.items[item.item.$$hashKey];
      $scope.updateShoppingCart($scope.shoppingCart);
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