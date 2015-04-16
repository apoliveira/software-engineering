var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('whiteboard', { title: 'Project Blackhawk' });
});

module.exports = router;
