var mongoose = require('mongoose');

var SubtasksSchema = new mongoose.Schema({
	name:String,
	done: Boolean
});

module.exports = mongoose.model('Subtasks', SubtasksSchema);