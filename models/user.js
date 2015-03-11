var mongoose = require('mongoose');

var UsersSchema =  new mongoose.Schema({
	username: String,
    password: String,
    email: String,
    gender: String,
    address: String,
    tasks: Array,
    lists: Array
})

module.exports = mongoose.model('User', UsersSchema);
