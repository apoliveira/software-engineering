var express = require('express');
var router = express.Router();
var Presentation = require('../models/presentation');
var fs = require('fs-extra');

/* GET presentation pdf */
router.get('/:id/pdf', function(req, res, next) {
  var id = req.params.id;
  Presentation.findOne(id, function(err, pdf) {
    if(err) {
      res.render('home', { title: 'Project Blackhawk' });
      throw(err);
    }

    fs.readFile("./pdfs/" + id + ".pdf", function (err, data){
      if(err) {
        console.log(err);
      }
      res.contentType("application/pdf");
      res.send(data);
    });
  });
});

router.get('/:id/present', function(req, res, next) {
  res.render('present', { title: 'Project Blackhawk', id: req.params.id });
});

module.exports = router;
