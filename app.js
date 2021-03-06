var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var pass = require('./config/pass');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./schemas/db');
// var mongoose = require('mongoose');
// var dbUri = process.env.MONGOHQ_URL || 'mongodb://localhost:27017/interstellar';
// mongoose.connect(dbUri);
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function callback () {
//     console.log("connection to db established");
// });
// var monk = require('monk');
// var db = monk('localhost:27017/interstellar')

var routes = require('./routes/index');
var login = require('./routes/login');
var logout = require('./routes/logout');
var signup = require('./routes/signup');
var events = require('./routes/events');
var myEvents = require('./routes/myEvents'); // angular test
var api = require('./routes/api');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req,res,next) {
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/login', login);
app.use('/logout', logout);
app.use('/signup', signup);
app.use('/events', events);
app.use('/myEvents', myEvents);
app.use('/api', api);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
