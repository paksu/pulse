/* global io */
'use strict';

angular.module('pulseApp')
  .factory('socket', function(socketFactory, $rootScope) {

    // socket.io now auto-configures its connection when we ommit a connection url
    var ioSocket = io('', {
      // Send auth token on connection, you will need to DI the Auth service above
      // 'query': 'token=' + Auth.getToken()
      path: '/socket.io-client'
    });

    var socket = socketFactory({
      ioSocket: ioSocket
    });
    /**
     * Syncs removed items on 'model:remove'
     */
    socket.on('msg', function (item) {
      $rootScope.$broadcast('addBeacon', item);
    });
    return {
      socket: socket
    };
  });
