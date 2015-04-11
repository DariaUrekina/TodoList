var express = require('express');
var router = express.Router();
var _ = require('lodash');
var mongoose = require('mongoose');
var List = require('../models/lists.js');
var Task= require('../models/tasks.js');
var User = require('../models/user.js');
var moment = require('moment');

module.exports = router;

router.get('/', function(req, res, next) { 
  List.find().sort('createdAt').find({'_id': {$in:req.user.lists } },function(err, lists){
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

router.post('/', function(req, res, next){
  req.body.createdAt = moment().format(); 
  req.body.updatedAt=moment().format();
  var user = req.user;
	List.create(req.body, function(err, list){
   	if(err) return next(err);
    console.log(user);
    user.lists.push(list._id.toString());
    user.save(function() {
      res.send(list);
      console.log(req.body);
    });

	});
});

router.delete('/:id', function(req, res, next) {
  var user = req.user;
    user.lists = _.filter(user.lists, function(list) {
      return (list != req.params.id)
    });
    user.save();
    res.send({state: 'List deleted'});
});
    

router.put('/:id', function(req, res, next) {
  List.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});
