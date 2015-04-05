var express = require('express');
var _ = require('lodash');
var router = express.Router();

var mongoose = require('mongoose');
var Task = require('../models/tasks.js');
var List = require('../models/lists.js');
var moment = require('moment');


module.exports = router;

/* GET /tasks listing. */
router.get('/', function(req, res, next) {  
  Task.find().sort('createdAt').find(function (err, tasks) {
    if (err) return next(err);  
    res.json(tasks);      
  });
});


/* POST /tasks */
router.post('/', function(req, res, next) {
  req.body.createdAt = moment().format(); 
  req.body.updatedAt=moment().format();
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
  Task.remove({"_id": {"$oid": req.params.task_id}});
    List.find({ tasks: req.params.task_id }, function(err, lists) {
      _.each(lists, function(list) {
        if (err) return next(err); 
        console.log(list);
        list.tasks = _.filter(list.tasks, function(task) {
          console.log(task._id);
          return (task !== req.params.task_id);
        });
        list.save();
      });
      res.send({state:'deleted!'});
    });
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



