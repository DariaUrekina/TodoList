var mongoose = require('mongoose'); 
//var Tasks = require('./tasks');

var ListsSchema =  new mongoose.Schema({
	name: String,
	tasks: Array
})

module.exports = mongoose.model('Lists', ListsSchema);