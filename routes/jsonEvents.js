var express = require('express');
var router = express.Router();
var pass = require('../config/pass');

router.get('/:username', pass.ensureAuthenticated, function (req, res, next) {
  var userRequest = req.params.username;
  var loggedIn = req.user.username;
  console.log(userRequest, loggedIn);
  if (loggedIn != userRequest) {
    res.send('Permission denied');
  } else{
    res.json({ user: req.user});
  }
});

module.exports = router;