
var express = require('express');
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
  uploader.post(req, res, function(obj) {
    res.send(JSON.stringify(obj));
  });
});

router.delete('/uploaded/files/:name', function(req, res) {
  uploader.delete(req, res, function(obj) {
    res.send(JSON.stringify(obj));
  });
});
  