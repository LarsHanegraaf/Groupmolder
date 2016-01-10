var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
  role: String,
  local:{
    firstName: String,
    lastName: String,
    email: {type: String, unique: true},
    password: String
  },
  facebook:{
    id: {type: String, unique: true},
    name: String
  }
});

module.exports = mongoose.model('User', userSchema);
