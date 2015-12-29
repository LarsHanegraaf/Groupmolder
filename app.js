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
var passport = require('passport');

passport.serializeUser(function(user, done) {
  done(null, user.facebook.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({'facebook.id':id}, function(err, user){
    done(err, user);
  })
});
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var fbConfig = require('./config/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({name: 'session',
        cookie: { maxAge: 60000 },
        secret: fbConfig.sessionSecret,
        resave: true,
        saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// authentication middleware

passport.use(new LocalStrategy({
  // override username with email
  usernameField: 'email',
  passwordField: 'password'
},
  function(username, password, done) {
    User.findOne({ 'local.email': email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (bcrypt.compareSync(password, user.local.password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: fbConfig.clientID,
    clientSecret: fbConfig.clientSecret,
    callbackURL: fbConfig.callbackURL
  },
  function(accessToken, refreshToken, profile, done){
    User.findOne({'facebook.id': profile.id}, function(err, user){
      if(err){
        return done(err);
      }
      if(user){ // if is user is found
        done(err, user);
      }else{
        var newuser = new User({
          facebook:{
            id: profile.id,
            name: profile.displayName
          }
        });
        newuser.save(function(err){
          if(err) console.log(err);
          return done(err, user);
        });
      }

    });
  }
));


// set locals variable to user in order to use it in jade
app.use(function(req, res, next){
  if(req.user){
    res.locals.username = req.user.facebook.name;
  }
  next();
})


app.use('/', routes);
app.use('/users', users);
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
