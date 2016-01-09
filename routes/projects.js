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

router.get('/:id', function(req,res) {
  Project.findById({ _id: req.params.id }, function(err, project) {
    if(err) throw err;

    res.json(project);
  });
});

router.get('/:id/groups', function(req,res) {
  Project.findById({ _id: req.params.id }, function(err, project) {
    if(err) throw err;
    res.json(project.groups);
  });
});

router.put('/:id', function(req,res) {
  Project.update({ _id: req.params.id },
    {$set: {name: req.body.name,
    subjectCode: req.body.subjectCode,
    numStudents: req.body.numStudents,
    numStudentsPerGroup: req.body.numStudentsPerGroup,
    numGroups: req.body.numGroups}},
  function(err, project) {
    if(err) throw err;

    res.json(project);
  });
});

router.delete('/:id', function(req,res) {
  Project.findById({ _id: req.params.id }, function(err, project) {
    if(err) throw err;

    project.remove(function(err) {
      if(err) throw err;

      res.json({"result": "succes!"});
    });
  });
});


module.exports = router;
