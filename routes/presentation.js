var express = require('express');
var router = express.Router();
var Presentation = require('../models/presentation');
var User = require("../models/user.js");
var formidable = require('formidable');
var fs = require('fs-extra');

/* GET presentation pdf */
router.get('/:id/pdf', function(req, res, done) {
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
        return done(err);
      }
      res.contentType("application/pdf");
      res.send(data);
    });
  });
});

// Present route
router.get('/:id/present', function(req, res, done) {
  res.render('present', { title: 'Project Blackhawk', id: req.params.id });
});

/* POST edit presentation info route */
router.post('/:id/edit', function(req, res, done) {
  /* NOTE: ADD CHECK TO SEE IF USER IS OWNER OF PRESENTATION */
  Presentation.findOne({_id: req.params.id}, function(err, presentation) {
    var form = new formidable.IncomingForm();

    // Set the settings of the upload function
    form.uploadDir = "./pdfs";
    form.keepExtensions = true;

    // Parse html form
    form.parse(req, function(err, fields, files) {
      // Set presentation object parameters
      if(fields.name && fields.name != "") {
        presentation.title = fields.name;
      }

      // Update presentation
      presentation.save(function(err) {
        if(err) return done(err);

        // If file was upload it, rename it to overwrite the current file
        if(files.pdf.size > 0) {
          fs.rename(files.pdf.path, presentation.pdf_path, function(err) {
            if(err) return done(err);
            res.redirect('/home');
          });
        // Else, delete the blank file that was uploaded
        } else {
          fs.unlink(files.pdf.path, function(err) {
            if(err) return done(err);
            res.redirect('/home');
          });
        }
      });
    });
  });
});

/* POST route for the delete presentation function */
router.post('/:id/delete', function(req, res, done) {
  /* NOTE: ADD CHECK TO SEE IF USER IS OWNER OF PRESENTATION */
  // Find the presentation you want to delete
  Presentation.findOne({_id : req.params.id}, function(err, presentation) {
    // Remove presentation from the mongo db
    Presentation.remove({_id : req.params.id}, function(err) {
      if(err) return done(err);

      // Delete the file
      fs.unlink("./pdfs/" + req.params.id + ".pdf", function(err) {
        if(err) return done(err);
        res.redirect('/home');
      });
    });
  });
});

/* POST method to upload a pdf */
router.post('/uploadPdf', function(req, res, next) {
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

    // Save presentation to db
    presentation.save(function(err) {
      if(err)
        return done(err);

      pdf_path = './pdfs/' + presentation._id + ".pdf";
      presentation.pdf_path = pdf_path;

      // Save presentation to db with updated pdf_path
      presentation.save(function(err) {
        if(err)
          return done(err);

        // Rename the file
        fs.rename(files.pdf.path, pdf_path, function(err) {
          if (err)
            return done(err);
        });
      });
    });
  });

  res.redirect("/home");
});

module.exports = router;

