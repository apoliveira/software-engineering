var express = require('express');
var router = express.Router();
var Presentation = require("../models/presentation.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  if( req.isAuthenticated() ) {
    Presentation.getByAuthor( req.user, function( pdfs ) {
      res.render('home', { title: 'Project Blackhawk', pdfs: pdfs });
    });
  } else {
    res.redirect("/login");
  }
});


module.exports = router;
