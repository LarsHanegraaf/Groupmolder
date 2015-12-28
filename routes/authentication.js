// var User = require('/models/user');

module.exports = function(app, passport){
  app.get('/auth/facebook', passport.authenticate('facebook'));
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {successRedirect: '',
                                      failureRedirect: '/login'}));
}
