/**
 * Created by 胡玉国 on 16/8/8.
 */


var socket = require('socket.io-client')('http://localhost:3000');
socket.on('connect', function(){
    console.log('connect...');
    for (var i=0;i<5;i++){
        socket.emit('event','data test, haha:' + i);
    }
});

socket.on('event', function(data){
    console.log('event...');
});

socket.on('add user', function (data) {
    console.log('add user:' + data);
});

socket.on('roomData', function (data) {
    console.log('roomData:' + data);
});

socket.on('disconnect', function(){
    console.log('disconnect...');
});

