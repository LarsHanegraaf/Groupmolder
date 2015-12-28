var express = require('express');
var router = express.Router();

// Has to be changed using mongoose instead of monk
// var mongoose = require('mongoose');
// var dbURL = require('../config/database.js').urlKoen;
// mongoose.connect(dbURL);

router.get('/', function(req, res) {
  //  var collection = db.get('projects');
  //  collection.find({}, function(err, projects){
  //      if (err) throw err;
  //    	 res.json(projects);
  //  });
});

module.exports = router;
