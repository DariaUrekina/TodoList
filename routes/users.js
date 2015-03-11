var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/home', function(req, res, next) {
  res.send('respond with a resource');
});


/*POST users listing*/

module.exports = router;
