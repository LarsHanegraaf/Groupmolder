var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var bcrypt = require('bcryptjs');

var dbURL = require('./config/database').url;
var mongoose = require('mongoose');
mongoose.connect(dbURL);
var User = require('./models/user');
var Group = require('./models/group');
var Project = require('./models/project');

var routes = require('./routes/index');
var users = require('./routes/users');
var projects = require('./routes/projects');
var authentication = require('./routes/authentication');

// authenticaton modules
var passport = require("passport");
require('./passport')(passport);

var fbConfig = require('./config/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({name: 'session',
        cookie: { maxAge: 60*60000 }, // in milliseconds, 60 minutes
        secret: fbConfig.sessionSecret,
        resave: true,
        saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// set locals variable to user in order to use it in jade
app.use(function(req, res, next){
  if(req.user){
    res.locals.user = req.user;
  }else{
    res.locals.user = {};
    res.locals.user.role = 'anon';
  }
  next();
})


app.use('/', routes);
app.use('/api/users', users);
app.use('/api/projects', projects);
authentication(app, passport);


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
