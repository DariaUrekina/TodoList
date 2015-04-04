var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
  name: String,
  expireAt: Date,
  done: Boolean,
  createdAt: Date,
  updatedAt: Date
});

module.exports = mongoose.model('Tasks', TaskSchema);