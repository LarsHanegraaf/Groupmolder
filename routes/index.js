var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.user.email){
    res.render('index', { title: 'You are logged in!'});
  }else{
    res.render('index', { title: 'GroupMolder' });
  }
});

module.exports = router;
