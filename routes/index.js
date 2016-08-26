var express = require('express');
var router = express.Router();
var logger = require('../server').logger('normal');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { msg: '确认uid' });
});

module.exports = router;
