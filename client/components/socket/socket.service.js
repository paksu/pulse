/* global io */
'use strict';

angular.module('pulseApp')
  .factory('socket', function(socketFactory) {

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
      TwtrGlobe.onTweet({ sentiment: { score: 221 }, coordinates: { coordinates: item[1]} });
    });
    return {
      socket: socket
    };
  });
