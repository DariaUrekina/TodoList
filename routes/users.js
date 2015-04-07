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

router.post('/', function(req, res, next){
  req.body.createdAt = moment().format(); 
  req.body.updatedAt=moment().format();
  var user = req.user;
	List.create(req.body, function(err, list){
		if(err) return next(err);
    	user.lists.push(list._id.toString());
    	user.save(function() {
      		res.send(list);
      		console.log(req.body);
   		 });
	});
});


router.post('/assigments', function(req,res,next) {
	var email = User.find({'email': req.body.user}); 
	console.log('email= ' + email);
	List.create(req.body, function(err, list) {
		if(err) return next(err);
		
	});
});





