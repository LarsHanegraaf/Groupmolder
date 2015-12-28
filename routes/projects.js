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

router.post('/', function(req, res) {
  Project.create({
    name: req.body.name,
    subjectCode: req.body.subjectCode,
    numStudents: req.body.numStudents,
    numStudentsPerGroup: req.body.numStudentsPerGroup,
    numGroups: req.body.numGroups
  }, function(err, newProject) {
    if (err) return handleError(err);

    res.json({"result": "succes!"});
  })
})


module.exports = router;
