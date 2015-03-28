var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
  name: String,
  expireAt: Date,
  done: Boolean
});

module.exports = mongoose.model('Tasks', TaskSchema);