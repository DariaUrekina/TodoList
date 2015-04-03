var express = require('express');
var format = require('util').format;
var router = express.Router();
var options = {
  tmpDir: __dirname + '/../public/uploaded/tmp',
  uploadDir: __dirname + '/../public/uploaded/files',
  uploadUrl: '/uploaded/files/',
  storage: {
    type: 'local'
  }
};

var uploader = require('blueimp-file-upload-expressjs')(options);

module.exports = router;


router.get('/', function(req, res) {
  uploader.get(req, res, function(obj) {
    res.send(JSON.stringify(obj));
  });
});

router.post('/', function(req, res) {
  console.log(req.params);
  console.log(req);
  uploader.post(req, res, function(obj) {
    res.send(JSON.stringify(obj));
  });
});

router.delete('/files/:name', function(req, res) {
  uploader.delete(req, res, function(obj) {
    res.send(JSON.stringify(obj));
  });
});
  