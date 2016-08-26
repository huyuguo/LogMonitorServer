/**
 * Created by 胡玉国 on 16/8/25.
 */

function onLoginHandler() {
    var uid = document.getElementById('uid').value;
    var pattern=/(^\+?[1-9][0-9]*$)/;
    if (!pattern.test(uid)) {
        alert('请输入正确的uid');
        return;
    }

    document.getElementById('loginForm').submit();
}

function onClearHandler() {
    document.getElementById('uid').value = '';
}