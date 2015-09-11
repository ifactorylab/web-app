'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:BookingCtrl
 * @description
 * # BookingCtrl
 * Controller of the webApp
 */
angular.module('webApp')
  .controller('BookingCtrl', function($scope, bookingApi) {
    $scope.showBookingPage = false;
    $scope.bookingTimeSlots = {};
    $scope.bookingNumPeople = {};
    $scope.bookingSucceeded = false;
    $scope.bookingFailed = false;
    $scope.errors = {};
    $scope.errors.name = false;
    $scope.errors.email = false;
    $scope.errors.phoneNumber = false;

    for (var i = 8; i < 24; i++) {
      var string1 = '';
      var string2 = '';
      var unit = 'AM';
      if (i > 11) {
        unit = 'PM';
      }

      var hh = i;
      if (i < 10) {
        hh = '0' + i;
      } else if (i > 12) {
        hh = i - 12;
      }

      string1 = hh + ':00 ' + unit;
      string2 = hh + ':30 ' + unit;

      $scope.bookingTimeSlots[i * 3600] = string1;
      $scope.bookingTimeSlots[i * 3600 + 30 * 60] = string2;
    }

    for (var i = 1; i < 7; i++) {
      var unit = 'People';
      if (i < 2) {
        unit = 'Person';
      }
      $scope.bookingNumPeople[i] = i + ' ' + unit;
    }

    $scope.booking = {};
    $scope.bookingNumPerson = 1;
    $scope.bookingTime = 8 * 3600;

    $scope.disabled = function(date, mode) {
      // return ( mode === 'day' && ( date.getDay() === 0 ) );
      return false;
    };

    $scope.today = function() {
      $scope.bookingDate = new Date();
    };
    $scope.today();

    $scope.clear = function () {
      $scope.bookingDate = null;
    };

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();
    $scope.maxDate = new Date();
    $scope.maxDate.setDate($scope.maxDate.getDate() + 365);

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1,
    };

    $scope.format = 'EEE MMM dd yyyy';

    $scope.findTable = function() {
      $scope.showBookingPage = true;
      $scope.booking.number_of_person = $scope.bookingNumPerson;
      $scope.booking.datetime =
        new Date(Date.parse($scope.bookingDate.toDateString() + ' 00:00:00') +
          ($scope.bookingTime * 1000));
      $scope.booking.gmt_offset = $scope.booking.datetime.getTimezoneOffset() * (-60);
    };

    $scope.hasError = function() {
      return ($scope.errors.name || $scope.errors.email || $scope.errors.phoneNumber);
    };

    $scope.closeSubmissionText = function() {
      $scope.bookingSucceeded = false;
      $scope.bookingFailed = false;
    };

    $scope.joinWithBR = function(description) {
      return description.join('<br />');
    };

    $scope.requestBooking = function() {
      var booking = $scope.booking;
      console.log($scope.booking);
      $scope.errors.name = (booking.first_name === null || booking.last_name === null ||
        booking.first_name === '' || booking.last_name === '');
      $scope.errors.email = (booking.email === null || booking.email === '');
      $scope.errors.phoneNumber = (booking.phone_number === null || booking.phone_number === '');

      if (!$scope.hasError()) {
        bookingApi.request($scope.site.id, booking).then(function(data) {
          $scope.showBookingPage = false;
          $scope.booking = {};
          $scope.today();
          $scope.bookingSucceeded = true;
        }, function(response) {
          $scope.bookingFailed = false;
          console.log(response.data.error.message);
        });
      }
    };
  });
