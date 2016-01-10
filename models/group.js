var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var groupSchema = new Schema({
  number: Number,
  members: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Group', groupSchema);
