var User = require('/models/user');

module.exports = function(passport){
  app.get('/facebook', passport.authenticate('facebook'));
  app.get('/facebook/callback',
    passport.authenticate('facebook', {successRedirect: '',
                                      failureRedirect: '/login'}));
}
