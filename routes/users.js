var express = require('express');
var router = express.Router();

var dbURL = require('../config/database').url;
var mongoose = require('mongoose');
mongoose.createConnection(dbURL);

var User = require('../models/user');
var Project = require('../models/project');

router.get('/', function(req, res) {
  if(req.user) {
  User.findOne({_id: req.user._id}).populate('groups').exec(function(err, users){
    if (err) throw err;

    res.json(users.groups);
  });
} else {
  res.json({"error": "Please login"});
}
});

module.exports = router;
