var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var fbConfig = require('./config/auth');
var User = require('./models/user');

module.exports = function(passport){
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findOne({'_id':id}, function(err, user){
      done(err, user);
    })
  });

  // authentication middleware

  passport.use(new LocalStrategy({
    // override username with email
    usernameField: 'email',
    passwordField: 'password'
    },
    function(email, password, done) {
      User.findOne({ 'local.email': email }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!bcrypt.compareSync(password, user.local.password)) {
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
}
