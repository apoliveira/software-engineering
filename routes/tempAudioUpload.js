var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs-extra');

/* POST  page. */
router.post('/', function(req, res, next) {
  var form = new formidable.IncomingForm();

  form.uploadDir = "./pdfs";
  form.keepExtensions = true;

  form.parse(req, function(err, fields, files) {
    console.log(files);
    fs.rename(files.audio.path, 'audio.wav', function(err) {
      if(err) return done(err);
    });
  });

  res.redirect('/home');
});

module.exports = router;
