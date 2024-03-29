var express = require('express');
var router = express.Router();

var dbURL = require('../config/database').url;
var mongoose = require('mongoose');
mongoose.createConnection(dbURL);

var Project = require('../models/project');
var Group = require('../models/group');
var User = require('../models/user');

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
  Project.findById({ _id: req.params.id }).populate('randomPool').exec(function(err, project){
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

router.get('/:id/groups/:number/check', function(req,res) {
  var joinedGroup = false;
  if(req.user) {
    for(i=0; i < req.user.groups.length; i++) {
      if(req.user.groups[i] == req.params.id) {
        res.json({"error": "User already joined group"});
        joinedGroup= true;
      }
    }
    if(!joinedGroup) {
      res.json({"check": "passed"});
    }
    joinedGroup=false;
  }else{
    //let the user know that is not logged in
    res.json({"status": "User not logged in"})
  }
});

router.post('/:id/groups/:number', function(req,res) {
  var joinedGroup = false;
  if(req.user) {
//make sure user doesn't join a project in which he/she already joined
    for(i=0; i < req.user.groups.length; i++) {
      if(req.user.groups[i] == req.params.id) {
        joinedGroup = true;
      }
    }
    if(joinedGroup){
      // let the user know that he already joined a group
      console.log("User already joined a group");
      joinedGroup = false;
    } else {
      Project.findById({ _id: req.params.id }, function(err, project) {
        if(err) throw err;
        //Make sure there are no more students in a group than allowed
        if(project.numStudentsPerGroup > project.groups[req.params.number-1].members.length) {
        project.groups[req.params.number-1].members.push({_id: req.user._id});
        project.save(function(err){
          if (err) throw err;
        });
        res.json(project.groups[req.params.number-1]);
      } else {
        res.json({"warning": "Group full"})
      }


      });
      User.findById({_id: req.user._id}, function(err, user) {
        if(err) throw err;
        console.log(user);
        user.groups.push({_id: req.params.id});
        user.save(function(err){
          if(err) throw err;
        });
      });
    }
  } else {
    //TODO let the user know that he is not logged in
    console.log('user not logged in')
  }
});

router.post('/:id/random', function(req,res) {
  var joinedGroup = false;
  if(req.user) {
//make sure user doesn't join a project in which he/she already joined
    for(i=0; i < req.user.groups.length; i++) {
      if(req.user.groups[i] == req.params.id) {
        joinedGroup = true;
      }
    }
    if(joinedGroup){
      //TODO let the user know that he already joined a group
      console.log("User already joined a group");
      joinedGroup = false;
    } else {
      Project.findById({ _id: req.params.id }, function(err, project) {
        if(err) throw err;

        project.randomPool.push({_id: req.user._id});
        project.save(function(err){
          if (err) throw err;
        });

        res.json(project);
      });
      User.findById({_id: req.user._id}, function(err, user) {
        if(err) throw err;
        console.log(user);
        user.groups.push({_id: req.params.id});
        user.save(function(err){
          if(err) throw err;
        });
      });
    }
  } else {
    //TODO let the user know that he is not logged in
    console.log('user not logged in')
  }
});

router.post('/:id/assignrandom', function(req,res) {
  var groupFilled = false;
  if(req.user.role == "teacher") {

    Project.findById({ _id: req.params.id }, function(err, project) {
      if(err) throw err;
      for(j=0; j < project.groups.length ; j++) {
        while(!groupFilled) {
        for(i = 0; i < project.randomPool.length; i++) {
          if(project.numStudentsPerGroup > project.groups[j].members.length) {
          project.groups[j].members.push({_id: project.randomPool[i]});
        }
        groupFilled = true;

      }
    }
  }
      project.randomPool = [];
      project.save(function(err){
        if (err) throw err;
      });
    });
      res.json({"succcess": true});
  } else {
    res.json({"error": "Not authorized"});
  }
});


router.put('/:id', function(req,res) {

  Project.update({ _id: req.params.id },
    {$set: {name: req.body.name,
    subjectCode: req.body.subjectCode}},
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
