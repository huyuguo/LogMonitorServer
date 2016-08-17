var express = require('express');
var router = express.Router();
var logger = require('../server').logger('normal');

/* GET users listing. */
router.get('/', function(req, res, next) {
  logger.info('user.js data');
  res.send('respond with a resource');
});

module.exports = router;
