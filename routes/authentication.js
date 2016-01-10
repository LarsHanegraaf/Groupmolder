var User = require('../models/user');
var bcrypt = require('bcryptjs');

module.exports = function(app, passport){

  app.post('/register', function(req, res){
    req.body.email = req.body.email.toLowerCase();
    User.findOne({'local.email': req.body.email}, function(err, user){
      if(err){
        return err;
      }
      if(!user){
        var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        var newUser = new User({
          role: req.body.role,
          local:{
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash,
          },
          facebook: null
        });
        newUser.save(function(err){
          if(err){
            res.render('/#/register');
          }else{
            res.redirect('/');
          }
        });
      }
    });
  });

  app.get('/#/login', function(req, res){
    res.render('layout');
  });

  app.get('/#/student', function(req, res){
    res.render('layout');
  });

  app.get('/#/project', function(req, res){
    res.render('layout');
  })

  app.post('/login', passport.authenticate('local'), function(req, res){
    if(req.user.role=== 'teacher'){
      res.redirect('/#/project');
    }else if(req.user.role === 'student'){
      res.redirect('/#/student');
    }else{
      res.redirect('/#/login');
    }
  });

  app.get('/auth/facebook', passport.authenticate('facebook'));
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {successRedirect: '/',
                                      failureRedirect: '/#/login'}));
  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}
