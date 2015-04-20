var flash = require("express-flash");
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

global.config = require("./config.js");

var mongoose = require("mongoose");
mongoose.connect(config.mongo);
global.mongoose = mongoose;

var passport = require("./passport/index");
global.passport = passport;

var index = require('./routes/index');
var home = require('./routes/home');
var login = require('./routes/login');
var logout = require('./routes/logout');
var signup = require('./routes/signup');
var whiteboard = require('./routes/whiteboard');
var settings = require('./routes/settings');

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
app.use(session( { secret : "SOME SUPER SECRET SECRET", resave: true, saveUninitialized: true } ));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/home', home);
app.use('/login', login);
app.use('/logout', logout);
app.use('/signup', signup);
app.use('/whiteboard', whiteboard);
app.use('/settings', settings);

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
