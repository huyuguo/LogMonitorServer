/**
 * Created by 胡玉国 on 16/8/25.
 */

var textarea_value = '';

function onloadSocket(uid, host) {
    var status = document.getElementById('status');
    var textarea = document.getElementById('textarea');
    var socket = io('http://' + host + ':8089');
    socket.on('connect', function(){
        status.innerText = '[' + uid + ']连接成功...';
        socket.emit('login',{type:'web',uid:uid});

        socket.on('disconnect', function(){
            status.innerText = '[' + uid + ']连接中...';
        });

        socket.on('login', function (data) {
            status.innerText = '[' + uid + ']' + data.msg;
        });

        socket.on('data', function(data){
            if(textarea.length > 40000) {
                clearTextArea();
            }
            textarea_value = JSON.stringify(data, null, 4) + '\n\n\n\n' + textarea_value;
            textarea.value = textarea_value;
        });
    });
}

function onClearHandler() {
    clearTextArea();
}

function clearTextArea() {
    document.getElementById('textarea').innerText = '';
    document.getElementById('textarea').value = '';
    textarea_value = '';
}

