var express = require('express');
var router = express.Router();

var dbURL = require('../config/database').url;
var mongoose = require('mongoose');
mongoose.createConnection(dbURL);

var Project = require('../models/project')

router.get('/', function(req, res) {
  Project.find({}, function(err, projects) {
    if (err) throw err;

    // Responds an JSON array of all projects in the database
    res.json(projects);
  });
});



module.exports = router;
