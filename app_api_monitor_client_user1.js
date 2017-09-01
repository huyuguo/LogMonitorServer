/**
 * Created by 胡玉国 on 2017/7/12.
 */


var socket = require('socket.io-client')('ws://localhost:5000');

socket.on('connect', function(){
  socket.emit('login', {
    'type':'user',
    'mobile': 13811028641
  });
  console.log(socket.connected);
  console.log(socket.disconnected);
  socket.disconnect();
});

socket.on('disconnect', function(){
  console.log('Your client is disconnected.');
});


socket.on('message', function (data) {
  console.log(JSON.stringify(data));
});


