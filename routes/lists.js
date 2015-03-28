var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var List = require('../models/lists.js');
var Task = require('../models/tasks.js');

module.exports = router;

router.get('/', function(req, res, next) { 
	List.find(function(err, lists){
		if(err) return next(err);
		res.json(lists);
		console.log(lists);
	});
});

router.get('/:id', function(req, res, next) {
  List.findById(req.params.id, function (err, list) {
    if (err) return next(err);
    Task.find({'_id': {$in: list.tasks} }, function (err, tasks) {
    	if (err) return next(err);
    	res.json(tasks);	
    });
  });
});

router.post('/', function(req, res, next){
	List.create(req.body, function(err, list){
		if(err) return next(err);
		res.send(
			(err === null) ? { msg: '' } : { msg: err }
			);
		console.log(list);
			
	});
});

router.put('/:id', function(req,res,next) {
	console.log(req.body);
	res.send(req.body);
})