var express = require('express');
var router = express.Router();
var pass = require('../config/pass');

/* GET home page. */
router.get('/', pass.ensureAuthenticated, function(req, res) {
  res.locals.user = { username: req.user.username, email: req.user.email };
  res.render('myEvents', { title: 'Mínir atburðir' });
});

module.exports = router;
