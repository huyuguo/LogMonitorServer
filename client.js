/**
 * Created by 胡玉国 on 16/8/8.
 */

// var socket = require('socket.io-client')('http://localhost:3000');
var socket = require('socket.io-client')('ws://localhost:3000');

var argv = process.argv;
if (argv.length != 3) {
    console.log('Please enter:node client.js uid');
    process.exit();
}

var uid = argv[2];

var pattern=/(^\+?[1-9][0-9]*$)/;
if (!pattern.test(uid)) {
    console.log('Please enter:node client.js uid');
    console.log('Please enter right uid');
    process.exit();
}

socket.on('connect', function(){
    console.log('uid = ' + uid);
    socket.emit('login',{type:'web',uid:uid});
});

socket.on('login',function (data) {
    if (data.status == 0) {
        console.log(data.msg);
    } else {
        console.log(data.msg);
        process.exit();
    }
});

socket.on('disconnect', function(){
    console.log('Your client is disconnected.');
});

socket.on('data', function (data) {
    console.log('data:' + data);
});

