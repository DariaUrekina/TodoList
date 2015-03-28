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


/* POST /lists */
router.post('/', function(req, res, next){
	List.create(req.body, function(err, list){
		if(err) return next(err);
		res.json(list);
	});
});


/* DELETE list*/
router.delete('/:id', function(req,res, next){
	/*var listToDelete=req.params.id;
	List.removeById(listToDelete, function(err, result) {
		res.send((result===1) ? {msg: ''} : {msg:'error' + err});
	});*/
	List.remove({_id: req.params.id}, function(err, list) {
      if (err) return next(err);
      res.send({state: 'ok!'});
    });
});

router.put('/:id', function(req, res, next) {
  List.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});
