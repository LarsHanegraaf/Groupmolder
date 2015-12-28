var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = require('mongoose').model('User').schema;

var groupSchema = new Schema({
  number: Number,
  members: [UserSchema]
});

module.exports = mongoose.model('Group', groupSchema);
