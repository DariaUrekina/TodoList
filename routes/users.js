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


router.post('/', function(req, res, next){
  req.body.createdAt = moment().format(); 
  req.body.updatedAt=moment().format();
	List.create(req.body, function(err, list){
		if(err) return next(err);
		res.json(list);
    console.log(req.body);
	});
});





