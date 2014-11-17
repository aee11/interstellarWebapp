var express = require('express');
var router = express.Router();
var moment = require('moment');
    moment.locale('is');
var async = require('async');
var Event = require('../schemas/event');
var User = require('../schemas/user');
var pass = require('../config/pass');

/* GET home page. */
//router.use(pass.ensureAuthenticated);

var getUserEvents = function (req, res, next) {
  User.find({ _id: req.user._id }).populate('events').lean().exec(function (err, user) {
    if (err) {
      return handleError(err);
    }
    req.events = user[0].events;
    next(); 
  });
}

var localizeDate = function (req, res, next) {
  async.each(req.events, function (sEvent, callback) {
    var localDate = moment(sEvent.nextReviewDate).format('D. MMM');
    sEvent.nextReviewDate = localDate;
    callback();
  }, function (err) {
    if (err) {
      console.error("async each on events failed");
    }
    next();
  });
}

router.get('/', pass.ensureAuthenticated, getUserEvents, localizeDate, function (req, res) {
  res.render('events', { title: 'Mínir atburðir', user: req.user, events: req.events });
});

router.post('/', function (req, res) {
  var currentDate = new Date();
  var nextReviewDate = moment(currentDate).add(7, 'days').toDate();
  var newEvent = new Event({
    user_id: req.user._id,
    title: req.body.title,
    courseName: req.body.course,
    glossaryLocation: req.body.glosLocation,
    dateAdded: currentDate,
    reviewCount: 0,
    nextReviewDate: nextReviewDate
  });
  newEvent.save(function (err) {
    if (err) {
      res.render('error', {
        error: 'Ekki tókst að vista atburðinn í gagnagrunni',
        message: ''
      });
    } else {
      console.log("Atburður skráður: ", newEvent._id);
      User.findByIdAndUpdate(req.user._id, { $push: { events: newEvent._id } }, function (err) {
        if (err) {
          res.render('error', {
            error: 'Ekki tókst að vista atburðinn í gagnagrunni',
            message: ''
          });
        }
      });
      res.redirect('/events');
    }
  });
});

module.exports = router;
