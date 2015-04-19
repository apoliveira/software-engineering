var express = require('express');
var router = express.Router();
var Presentation = require("../models/presentation.js");
var User = require("../models/user.js");
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
  
  // Parse html form
  form.parse(req, function(err, fields, files) {
    // Create presentation object
    var presentation = new Presentation({
      author_id: req.user._id,
      title:  fields.name,
      pdf_path: "temp"
    });

    pdf_path = './pdfs/' + presentation._id + ".pdf";
    presentation.pdf_path = pdf_path;

    // Save presentation to db
    presentation.save(function(err) {
      if(err) {
        return done(err);
      }
    });

    // Rename the file
    fs.rename(files.pdf.path, pdf_path, function(err) {
      if (err)
        return done(err);
    });
  });


  res.redirect("/home");
});

module.exports = router;
