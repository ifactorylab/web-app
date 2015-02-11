'use strict';

angular.module('webApp')
  .service('menusService', function MenusService($window) {
    var totalPrice = 0.0;
    var shoppingCart = {};
    return {
      updateShoppingCart: function(cart) {
        shoppingCart = cart;
        angular.element($window).trigger('update_cart');
      },
      getShoppingCart: function() {
        return shoppingCart;
      },
      setTotalPrice: function(price) {
        totalPrice = price;
        angular.element($window).trigger('update_price');
      },
      getTotalPrice: function() {
        return totalPrice;
      }
    };
  });
