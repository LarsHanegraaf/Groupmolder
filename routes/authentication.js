var User = require('../models/user');
var bcrypt = require('bcryptjs');

module.exports = function(app, passport){
  app.get('/register', function(req, res){
    res.render('register');
  });

  app.post('/register', function(req, res){
    req.body.email = req.body.email.toLowerCase();
    User.findOne({'local.email': req.body.email}, function(err, user){
      if(err){
        return err;
      }
      if(!user){
        var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        var newUser = new User({
          local:{
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash
          }
        });
        newUser.save(function(err){
          if(err){
            res.render('register');
          }else{
            res.redirect('/');
          }
        });
      }
    });
  });

  app.get('/login', function(req, res){
    res.render('login');
  });

  app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                     failureRedirect: '/login' }));

  app.get('/auth/facebook', passport.authenticate('facebook'));
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {successRedirect: '/',
                                      failureRedirect: '/login'}));
  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  app.get('/profile', isLoggedIn, function(req, res){
    res.send('you are logged in!');
  })
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
