'use strict';

angular.module('pulseApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.countries = [];
    socket.socket.on('msg', function (item) {
      $scope.countries.unshift(item[0]);
      if($scope.countries.length > 20) {
        $scope.countries.pop();
      }
    });
  });
