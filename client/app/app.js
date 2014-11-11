'use strict';

angular.module('pulseApp', [
  'ngSanitize',
  'ui.bootstrap',
  'btford.socket-io',
  'ui.router'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });