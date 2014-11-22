var express = require('express');
var pass = require('../config/pass');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  if (req.user != null) {
    return res.redirect('/');
  }
  console.log("Displaying login");
  res.render('login', { title: 'Innskráning' });
});

// passport.use(new LocalStrategy(
//     {usernameField: 'email', passwordField: 'password'},
//     function(email, password, done) {
//         if(canLogin) done(null, user);
//         else done({message: "This is an error message" }, false, { message: "Some Info" });
//     }
// ));

var postLogin = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    console.log('authenticate callback');
    if (err) { return next(err) }
    if (!user) {
      req.session.messages =  [info.message];
      return res.render('login', {title: 'Login', message: req.session.messages })
      // return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      res.locals.user = { username: user.username, email: user.email };
      return res.redirect('/myEvents');
      // return res.render('events', { title: "Atburðir", user: req.user });
    });
  })(req, res, next);
};

router.post('/', postLogin);

// router.post('/', passport.authenticate('local', function (err, user, info) {
//     console.log('authenticate callback');
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       return res.redirect('/');
//     }
//     req.logIn(user, function(err) {
//       if (err) {
//         return next(err);
//       }
//       return res.render('index', { title: 'Login success', username : user })
//     })(req, res, next)
//   },
//   function(err, req, res, next) {
//     // failure in login test route
//     return res.send({'status':'err','message':err.message});
//   })
// );
// router.post('/',
//                 passport.authenticate('local', {
//                 successRedirect: '/index',
//                 failureRedirect: '/loginFailure'
//                 })
// );

module.exports = router;