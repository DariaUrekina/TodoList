var express = require('express');
var _ = require('lodash');
var router = express.Router();
var mongoose = require('mongoose');
var Subtask = require('../models/subtasks.js');
var Task = require('../models/tasks.js');
var List = require('../models/lists.js');
var moment = require('moment');

module.exports = router;

/* GET /Subtasks listing. */
router.get('/', function(req, res, next) {  
  Subtask.find().sort('createdAt').find(function (err, subtasks) {
    if (err) return next(err);
    res.json(subtasks);      
  });
});


/* POST /Subtasks */
router.post('/', function(req, res, next) {
  req.body.createdAt = moment().format(); 
  req.body.updatedAt=moment().format();
  Subtask.create(req.body.subtask, function (err, subtask) {
    console.log('subtask');
    console.log(subtask);
    if (err) return next(err);
    Task.findById(req.body.task_id, function(err, task) {
      console.log('task');
      console.log(task);
      if (err) return next(err);
      task.subtasks.push(subtask._id.toString());
      task.save();
      res.send(subtask);
    });
  });	
});

/*  DELETE Subtasks */
router.delete('/:subtask_id', function(req, res,next) {   
  Subtask.remove({"_id": {"$oid": req.params.subtask_id}});
    Task.find({ subtasks: req.params.subtask_id }, function(err, tasks) {
      _.each(tasks, function(task) {
        if (err) return next(err); 
          task.subtasks = _.filter(task.subtasks, function(subtask) {
          console.log(subtask._id);
          return (subtask !== req.params.subtask_id);
        });
        task.save();
      });
      res.send({state:'deleted!'});
    });
});

/* GET /Subtasks/id */

router.get('/:id', function(req, res, next) {
  Subtask.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


/* PUT /Subtasks/:id */
router.put('/:id', function(req, res, next) {
  Subtask.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});



