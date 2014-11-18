var express = require('express');
var router = express.Router();
var pass = require('../config/pass');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('myEvents', { title: 'Mínir atburðir' });
});

module.exports = router;
