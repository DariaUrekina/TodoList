var express = require('express');
var _ = require('lodash');
var router = express.Router();

var mongoose = require('mongoose');
var Task = require('../models/tasks.js');
var List = require('../models/lists.js');

/* GET /tasks listing. */
router.get('/', function(req, res, next) {  
  Task.find(function (err, tasks) {
    if (err) return next(err);  
    res.json(tasks);      
  });
});


/* POST /tasks */
router.post('/', function(req, res, next) {
  Task.create(req.body.task, function (err, task) {
    if (err) return next(err);
    List.findById(req.body.list_id, function(err, list) {
      if (err) return next(err);
      list.tasks.push(task._id.toString());
      list.save();
      res.send(task);
    });
  });
	
});

/*  DELETE tasks */
router.delete('/:task_id', function(req, res,next) {
  // @@TODO get list which has task_id in its tasks array.
  // @@TODO remove id from array 
    Task.remove({"_id": {"$oid": req.params.task_id}});
    List.find({ tasks: req.params.task_id }, function(err, lists) {
      _.each(lists, function(list) {
        if (err) return next(err); 
        console.log(list);
        list.tasks = _.filter(list.tasks, function(task) {
          return (task._id == req.params.task_id);
        });
        list.save();
      });
      res.send({state:'deleted!'});
    });
  //Task.removeById(req.params.id, function(err, result) {
    //    res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
  //irr
});


/* GET /tasks/id */
router.get('/:id', function(req, res, next) {
  Task.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});



/* PUT /tasks/:id */
router.put('/:id', function(req, res, next) {
  Task.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;