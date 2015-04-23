var express = require('express');
var router = express.Router();

// Redirect requests without ids
router.get('/', function(req, res, next) {
  res.redirect("/");
});

router.get('/:id', function(req, res, next) {
  var id = req.params.id;
  res.render('whiteboard', { title: 'Project Blackhawk', id: id });
});

module.exports = router;
