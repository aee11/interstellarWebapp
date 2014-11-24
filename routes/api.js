var express = require('express');
var router = express.Router();
var pass = require('../config/pass');
var User = require('../schemas/user');
var Event = require('../schemas/event');
var moment = require('moment');
    moment.locale('is');

//TODO: nota router.param('user') fyrir :user

var getEvents = function (req, res, next) {
  var userRequestName = req.params.username;
  var loggedIn = req.user.username;
  console.log(req.user);
  if (loggedIn != userRequestName) {
    res.status(401).end('Permission denied');
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
  var userRequestName = req.params.username;
  var loggedIn = req.user.username;
  if (loggedIn != userRequestName || req.user._id != req.body.user_id) {
    return res.status(401).send('Permission denied');
  }
  var updatedEvent = req.body;
  var eventId = req.params.id;

  Event.update({_id: eventId, user_id: req.user._id}, {
    $set: {
      title: updatedEvent.title,
      courseName: updatedEvent.courseName,
      glossaryLocation: updatedEvent.glossaryLocation
    }
  }, function (err) {
    if (err) {
      console.error("Event update failed", eventId);
      res.status(404).end();
    }
    res.status(200).end();
  })
}

router.put('/user/:username/events/:id', pass.ensureAuthenticated, updateEvent);

var addEvent = function (req, res) {
  var userRequestName = req.params.username;
  var loggedIn = req.user.username;
  if (loggedIn != userRequestName) {
    return res.status(401).end('Permission denied');
  }
  var currentDate = new Date();
  var nextReviewDate = moment(currentDate).add(7, 'days').toDate();
  var newEvent = new Event({
    user_id: req.user._id,
    title: req.body.title,
    courseName: req.body.courseName,
    glossaryLocation: req.body.glossaryLocation,
    dateAdded: currentDate,
    reviewCount: 0,
    nextReviewDate: nextReviewDate
  });
  console.log(newEvent);
  newEvent.save(function (err, event) {
    if (err) {
      return res.render('error', {
        error: 'Ekki tókst að vista atburðinn í gagnagrunni',
        message: ''
      });
    } else {
      console.log("Atburður skráður: ", newEvent._id);
      User.findByIdAndUpdate(req.user._id, { $push: { events: newEvent._id } }, function (err) {
        if (err) {
          return res.render('error', {
            error: 'Ekki tókst að vista atburðinn í gagnagrunni',
            message: ''
          });
        }
      });
      res.status(200).json(event.toJSON());
    }
  });
}

router.post('/user/:username/events', pass.ensureAuthenticated, addEvent);

var deleteEvent = function (req, res, next) {
  var userRequestName = req.params.username;
  var loggedIn = req.user.username;
  if (loggedIn != userRequestName) {
    return res.status(401).send('Permission denied');
  }
  Event.remove({_id: req.params.eventId, user_id: req.user._id}, function (err) {
    console.log("Removed event");
    if (err) {
      return res.status(500).end();
    }
    User.update({_id: req.user._id}, {$pull: {events: req.params.eventId}}, function (err) {
      if (err) {
        console.log("Failed to remove from user");
        return res.status(500).end();
      }
      console.log("Event removed from user");
      res.status(200).end();
    });
  });
}

router.delete('/user/:username/events/:eventId', pass.ensureAuthenticated, deleteEvent);

var updateReviewDate = function (req, res, next) {
  var userRequestName = req.params.username;
  var loggedIn = req.user.username;
  if (loggedIn != userRequestName) {
    return res.status(401).send('Permission denied');
  }

  Event.findOne({_id: req.params.eventId, user_id: req.user._id}, function (err, singleEvent) {
    if (err) {
      return res.status(500).end();
    }
    singleEvent.updateReviewDate(function (err, updatedReviewDate) {
      if (err) {
        console.log(err);
        return res.status(500).end();
      }
      res.status(200).json({updatedReviewDate: updatedReviewDate});
    })
  })
}

router.put('/user/:username/events/:eventId/updateReviewDate', pass.ensureAuthenticated, updateReviewDate);



module.exports = router;