var express = require('express');
var router = express.Router();
var pass = require('../config/pass');

/* GET home page. */
router.get('/', pass.ensureAuthenticated, function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;