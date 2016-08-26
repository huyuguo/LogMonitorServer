var express = require('express');
var router = express.Router();
var logger = require('../server').logger('normal');
var users = require('../server').users;


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
    res.render('login', { uid: params['uid'] });
  }

});

module.exports = router;
