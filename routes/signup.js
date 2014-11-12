var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('../schemas/user.js');
var router = express.Router();


// var jsonParser = bodyParser.json();
// var urlencodedParser = bodyParser.urlencoded({ extended: false });

// router.use(urlencodedParser);

/* GET home page. */
router.get('/', function(req, res) {
  res.render('signup', { title: 'Nýskráning' });
});

router.post('/', function(req,res) {
  console.log(req.body.username);
  var db = req.db;

  //var collection = db.get('usercollection');
  var user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });
  //db.model(user);
  console.log(db);
  // var username = req.body.username,
  //     email = req.body.email,
  //     password = req.body.password;
  user.save(function (err) {
    console.log("SAVING");
    if (err) {
      res.render('error', {
        error: 'Ekki tókst að vista notandann í gagnagrunní',
        message: ''
      });
    } else {
      res.render('index', {title: 'Til hamingju'});
    }
  });
});

module.exports = router;