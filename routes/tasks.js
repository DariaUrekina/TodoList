var express = require('express');
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
      list.tasks.push(task._id);
      list.save();
      res.send({state: 'ok!'});
    });
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

module.exports = router;