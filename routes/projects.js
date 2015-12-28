var express = require('express');
var router = express.Router();

// Has to be changed using mongoose instead of monk
var monk = require('monk');
var dbUrl = require('../config/database.js').urlKoen;
var db = monk(dbUrl);

router.get('/', function(req, res) {
   var collection = db.get('projects');
   collection.find({}, function(err, projects){
       if (err) throw err;
     	 res.json(projects);
   });
});

module.exports = router;
