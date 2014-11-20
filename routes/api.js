var express = require('express');
var router = express.Router();
var pass = require('../config/pass');
var User = require('../schemas/user');
var Event = require('../schemas/event');

//TODO: nota router.param('user') fyrir :user

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

var updateEvent = function (req, res) {
  console.log("Update event request received");
  var userRequestName = req.params.username;
  var loggedIn = req.user.username;
  if (loggedIn != userRequestName || req.user._id != req.body.user_id) {
    res.json({message:'Permission denied'});
  }
  var updatedEvent = req.body;
  var eventId = req.params.id;
  // Event.findById(eventId, function (err, event) {
  //   if (err) {
  //     console.error("Could not find event", eventId);
  //   }

  // });
  Event.update({_id: eventId}, {
    $set: {
      title: updatedEvent.title,
      courseName: updatedEvent.courseName,
      glossaryLocation: updatedEvent.glossaryLocation
    }
  }, function (err) {
    if (err) {
      console.error("Event update failed", eventId);
    }
  })
}

router.put('/user/:username/events/:id', pass.ensureAuthenticated, updateEvent)


module.exports = router;