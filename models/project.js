var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var GroupSchema = require('mongoose').model('Group').schema;

var projectSchema = new Schema({
  name: String,
  subjectCode: String,
  numStudents: Number,
  numStudentsPerGroup: Number,
  numGroups: Number,
  deadlineSubscription: Date,
  groups: [GroupSchema],
  admin: [{type: Schema.Types.ObjectId, ref: 'User'}],
  randomPool: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Project', projectSchema);
