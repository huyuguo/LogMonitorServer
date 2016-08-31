var express = require('express');
var router = express.Router();
var logger = require('../server').logger('normal');
var users = require('../server').users;
var os = require('os');

router.get('/', function (req, res, next) {
  res.render('index', { msg: '确认手机号' });
});

router.post('/', function (req, res, next) {
  var params = req.body;
  var contained = false;
  if(users.length !=0) {
    users.forEach(function (user) {
      if (user.data.uid == params['uid']) {
        contained = true;
      }
    });
  }

  if (contained) { // 已登录
    res.render('index', { msg: '[' + params['uid'] + ']已在其他地方登录', uid:params['uid'] });
  } else { // 未登录
    var b = new Buffer(IPv4());
    console.log(b.toString('base64'));
    var xx = express;
    console.log(xx);
    res.render('login', { uid: params['uid'], host: IPv4()});
  }

});

function IPv4()  {
  var platform = os.platform();
  if (platform == 'darwin') {
    var en0 = os.networkInterfaces().en0;
    var length = en0.length;
    for (var i=0;i<length;i++) {
      if (en0[i].family == 'IPv4') {
        return en0[i].address;
      }
    }
  }
  else if (platform == 'linux') {
    var eth0 = os.networkInterfaces().eth0;
    var length = eth0.length;
    for (var i=0;i<length;i++) {
      if (eth0[i].family == 'IPv4') {
        return eth0[i].address;
      }
    }
  }
  else {
    return 'Unkown IPv4';
  }
}

module.exports = router;
