// var User = require('/models/user');

module.exports = function(app, passport){
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
