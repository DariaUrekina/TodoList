var mongoose = require('mongoose'); 

var ListsSchema =  new mongoose.Schema({
	name: String,
	tasks: Array,
	createdAt: Date,
	updatedAt: Date
})

module.exports = mongoose.model('Lists', ListsSchema);