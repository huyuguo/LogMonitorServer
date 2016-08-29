/**
 * Created by 胡玉国 on 16/8/25.
 */

var textarea_value = '';

function onloadSocket(uid) {
    var status = document.getElementById('status');
    var textarea = document.getElementById('textarea');
    var socket = io('http://192.168.1.199:8089');
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
            textarea_value += obj2str(data) + '\n\n\n\n';
            textarea.innerText = textarea_value;
        });
    });
}

function onClearHandler() {
    document.getElementById('textarea').innerText = '';
    textarea_value = '';
}

function obj2str(o){
    var r = [];
    if(typeof o == "string" || o == null) {
        return o;
    }
    if(typeof o == "object"){
        if(!o.sort){
            r[0]="{"
            for(var i in o){
                r[r.length]=i;
                r[r.length]=":";
                r[r.length]=obj2str(o[i]);
                r[r.length]=",";
            }
            r[r.length-1]="}"
        }else{
            r[0]="["
            for(var i =0;i<o.length;i++){
                r[r.length]=obj2str(o[i]);
                r[r.length]=",";
            }
            r[r.length-1]="]"
        }
        return r.join("");
    }
    return o.toString();
}
