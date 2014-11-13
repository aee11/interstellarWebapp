var db = require('../schemas/db'),
    userModel = require('../schemas/user'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  userModel.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  console.log("LocalStrategy");
  userModel.findOne({ "username" : username }, function (err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, { message : 'Þetta notendanafn er ekki til' });
    }
    user.comparePassword(password, function (err, isMatch) {
      if (err) {
        return done(err);
      }
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Rangt lykilorð' })
      }
    })
  });
  // db.userModel.findOne({ username: username }, function(err, user) {
  //   if (err) { return done(err); }
  //   if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
  //   user.comparePassword(password, function(err, isMatch) {
  //     if (err) return done(err);
  //     if(isMatch) {
  //       return done(null, user);
  //     } else {
  //       return done(null, false, { message: 'Invalid password' });
  //     }
  //   });
  // console.log(username, password);
  // console.log("USER AUTHENTICATED");
  // done(null, {username : username, password : password});  
  })
);

// Simple route middleware to ensure user is authenticated.  Otherwise send to login page.
var ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

module.exports = ensureAuthenticated;