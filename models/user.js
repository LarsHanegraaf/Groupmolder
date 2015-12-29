var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
  local:{
    firstName: String,
    lastName: String,
    email: {type: String, unique: true}
  },
  facebook:{
    id: {type: String, unique: true},
    name: String
  }
});

module.exports = mongoose.model('User', userSchema);
