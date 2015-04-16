var express = require('express');
var router = express.Router();
var Presentation = require("../models/presentation.js");
var formidable = require("formidable");
var fs = require("fs-extra");

/* GET uploadPdf page. */
router.get('/', function(req, res, next) {
  if( !req.isAuthenticated() ) {
    res.redirect("/login");
  } else {
    res.render('uploadPdf', { title: 'Project Blackhawk' });
  }
});

/* POST uploadPdf page */
router.post('/', function(req, res, next) {
  var form = new formidable.IncomingForm();

  // Set the upload directory
  form.uploadDir = "./pdfs";
  form.keepExtensions = true;

  // Rename the file
  form.parse(req, function(err, fields, files) {
    fs.rename(files.pdf.path, './pdfs/' + files.pdf.name, function(err) {
      if (err)
        throw err;
    });
    res.end();
  });
});

module.exports = router;
