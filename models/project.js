var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projectSchema = new Schema({
  name: String,
  subjectCode: String,
  numStudents: Number,
  numStudentsPerGroup: Number,
  numGroups: Number,
  groups: [{
    groupNumber: Number,
    members: [{
      id: String,
      name: String
    }]
  }]
});

module.exports = mongoose.model('Project', projectSchema);
