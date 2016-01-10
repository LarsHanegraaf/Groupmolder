var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  role: String,
  local:{
    firstName: String,
    lastName: String,
    email: String,
    password: String
  },
  facebook:{
    id: String,
    name: String
  },
  groups: [{type: Schema.Types.ObjectId, ref: 'Group'}]
});

module.exports = mongoose.model('User', userSchema);
