var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('mongodb://group08:moldergroup@ds035735.mongolab.com:35735/groupmolder');

router.get('/', function(req, res) {
    var collection = db.get('projects');
    collection.find({}, function(err, projects){
        if (err) throw err;
      	res.json(projects);
    });
});

module.exports = router;
