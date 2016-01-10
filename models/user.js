var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
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
  }
});

module.exports = mongoose.model('User', userSchema);
