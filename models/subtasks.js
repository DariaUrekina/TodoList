var mongoose = require('mongoose');

var SubtasksSchema = new mongoose.Schema({
	name:String
});

module.exports = mongoose.model('Subtasks', SubtasksSchema);