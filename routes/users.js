var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user.js');
var List = require('../models/lists.js');

module.exports = router;

router.get('/', function(req, res, next) { 
	User.find(function(err, user){
		if(err) return next(err);
		res.json(user);
		console.log(user);
	});
});

router.get('/logout', function(req, res){
    req.logout();
 	res.redirect('/');
});


router.post('/assigments', function(req,res,next) {		
	var newlist=[];
	var id =req.body.id;
	User.find({'email': req.body.email}, function(err, user) {
		console.log(user);
		console.log(req.body.email);
		console.log(id);		
		if(err) return next(err);
		user[0].lists.push(id);
		user[0].save(function(list) {
	    	res.send(list);
	    	console.log( req.body);
    	});
	}); 
});







