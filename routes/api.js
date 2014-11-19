var express = require('express');
var router = express.Router();
var pass = require('../config/pass');
var User = require('../schemas/user');

var getEvents = function (req, res, next) {
  var userRequestName = req.params.username;
  var loggedIn = req.user.username;
  console.log(req.user);
  if (loggedIn != userRequestName) {
    res.send('Permission denied');
  } else {
    User.find({ _id: req.user._id }).populate('events').lean().exec(function (err, user) {
      if (err) {
        return next(err);
      }
      events = user[0].events;
      res.json(events);
    });
  }
}

router.get('/user/:username/events', pass.ensureAuthenticated, getEvents);

var getUser = function (req, res, next) {
  res.json({username:req.user.username});
}

router.get('/username', pass.ensureAuthenticated, getUser);


module.exports = router;