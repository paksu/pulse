'use strict';

angular.module('pulseApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.beacons = 0;
    socket.socket.on('msg', function (item) {
      $scope.beacons = $scope.beacons + 1;
    });
  });
