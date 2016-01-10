var express = require('express');
var router = express.Router();

var dbURL = require('../config/database').url;
var mongoose = require('mongoose');
mongoose.createConnection(dbURL);

var Project = require('../models/project');
var Group = require('../models/group');

router.get('/', function(req, res) {
  Project.find({}, function(err, projects) {
    if (err) throw err;

    // Responds an JSON array of all projects in the database
    res.json(projects);
  });
});

router.post('/', function(req, res) {
  var numberGroups = Math.ceil(req.body.numStudents/req.body.numStudentsPerGroup)
  Project.create({
    name: req.body.name,
    subjectCode: req.body.subjectCode,
    numStudents: req.body.numStudents,
    numStudentsPerGroup: req.body.numStudentsPerGroup,
    numGroups: numberGroups
  }, function(err, newProject) {
    if (err) return handleError(err);

    for(i=0; i < numberGroups; i++) {
      newProject.groups.push({number: i + 1});
    }

    newProject.save(function(err) {
    if (err) throw err;

    console.log('Project saved successfully!');
    });
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
  Project.findOne({_id: req.params.id}).populate('groups.members').exec(function(err, project){
    if(err) throw err;

    res.json(project.groups);
  });
});

router.get('/:id/groups/:number', function(req,res) {
  Project.findById({ _id: req.params.id }).populate('groups.members').exec(function(err, project){
    if(err) throw err;

    res.json(project.groups[req.params.number-1]);
  });
});

router.post('/:id/groups/:number', function(req,res) {
  Project.findById({ _id: req.params.id }, function(err, project) {
    if(err) throw err;

    project.groups[req.params.number-1].members.push({_id: req.user._id});
    project.save(function(err){
      if (err) throw err;
    });
    res.json(project.groups[req.params.number-1]);
  });
});
/*
router.post('/:id/groups', function(req,res) {
  req.user._id
})*/

router.put('/:id', function(req,res) {
  var numberGroups = Math.ceil(req.body.numStudents/req.body.numStudentsPerGroup)
  Project.update({ _id: req.params.id },
    {$set: {name: req.body.name,
    subjectCode: req.body.subjectCode,
    numStudents: req.body.numStudents,
    numStudentsPerGroup: req.body.numStudentsPerGroup,
    numGroups: numberGroups}},
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

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

module.exports = router;
