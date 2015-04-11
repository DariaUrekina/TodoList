var express = require('express');
var _ = require('lodash');
var router = express.Router();
var mongoose = require('mongoose');
var Subtask = require('../models/Subtasks.js');
var List = require('../models/lists.js');
var moment = require('moment');



module.exports = router;

/* GET /Subtasks listing. */
router.get('/', function(req, res, next) {  
  Subtask.find().sort('createdAt').find(function (err, Subtasks) {
    if (err) return next(err);
    res.json(Subtasks);      
  });
});


/* POST /Subtasks */
router.post('/', function(req, res, next) {
  req.body.createdAt = moment().format(); 
  req.body.updatedAt=moment().format();
  Subtask.create(req.body.Subtask, function (err, Subtask) {
    if (err) return next(err);
    List.findById(req.body.list_id, function(err, list) {
      if (err) return next(err);
      list.Subtasks.push(Subtask._id.toString());
      list.save();
      res.send(Subtask);
    });
  });	
});

/*  DELETE Subtasks */
router.delete('/:Subtask_id', function(req, res,next) {   
  Subtask.remove({"_id": {"$oid": req.params.Subtask_id}});
    List.find({ Subtasks: req.params.Subtask_id }, function(err, lists) {
      _.each(lists, function(list) {
        if (err) return next(err); 
        console.log(list);
        list.Subtasks = _.filter(list.Subtasks, function(Subtask) {
          console.log(Subtask._id);
          return (Subtask !== req.params.Subtask_id);
        });
        list.save();
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



