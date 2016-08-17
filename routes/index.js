var express = require('express');
var router = express.Router();
var logger = require('../server').logger('normal');

/* GET home page. */
router.get('/', function(req, res, next) {
  logger.info('index.js data');
  res.render('index', { title: 'Express' });
});

module.exports = router;
