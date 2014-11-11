'use strict';

angular.module('pulseApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    console.log(socket);
    window.debug =socket;
  });
