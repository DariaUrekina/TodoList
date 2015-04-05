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



