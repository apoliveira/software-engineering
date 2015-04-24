var express = require('express');
var router = express.Router();
var Presentation = require('../models/presentation');
var formidable = require('formidable');
var fs = require('fs-extra');

/* GET presentation pdf */
router.get('/:id/pdf', function(req, res, next) {
  var id = req.params.id;

  // Get the presentation from the db
  Presentation.findOne(id, function(err, pdf) {
    if(err) {
      res.render('home', { title: 'Project Blackhawk' });
      throw(err);
    }

    // Send the pdf file to the response
    fs.readFile("./pdfs/" + id + ".pdf", function (err, data){
      if(err) {
        console.log(err);
      }
      res.contentType("application/pdf");
      res.send(data);
    });
  });
});

// Present route
router.post('/:id/present', function(req, res, next) {
  res.render('present', { title: 'Project Blackhawk', id: req.params.id });
});

/* POST edit presentation info route */
router.post('/:id/edit', function(req, res, next) {
  /* NOTE: ADD CHECK TO SEE IF USER IS OWNER OF PRESENTATION */
  Presentation.fineOne(id, function(err, presentation) {
    var form = new formidable.IncomingForm();

    // Set the settings of the upload function
    form.uploadDir = "./pdfs";
    form.keepExtensions = true;

    // Parse html form
    form.parse(req, function(err, fields, files) {
      // Set presentation object parameters
      if(fields.name && fields.name !== "")
        presentation.title = fields.name;

      // If file was upload it, rename it to overwrite the current file
      if(files) {
        fs.rename(files.pdf.path, presentation.pdf_path, function(err) {
          if(err) return done(err);
        });
      }

      // Update presentation
      presentation.save(function(err) {
        if(err) return done(err);
      });
    });
  });

  res.redirect('/home');
});

/* POST route for the delete presentation function */
router.post('/:id/delete', function(req, res, next) {
  /* NOTE: ADD CHECK TO SEE IF USER IS OWNER OF PRESENTATION */
  // Find the presentation you want to delete
  Presentation.findOne(id, function(err, presentation) {
    fs.unlink(presentation.pdf_path, function(err) {
      if(err) done(err);
    });

    // Remove presentation from the mongo db
    Presentation.remove({_id : id}, function(err) {
      if(err) return done(err);
    });
  });

  res.redirect('/home');
});

module.exports = router;

