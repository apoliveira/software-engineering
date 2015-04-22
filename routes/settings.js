var express = require('express');
var router = express.Router();
var User = require("../models/user.js");

/* GET settings page. */
router.get('/', function(req, res, next) {
  if(req.isAuthenticated() ) {
    res.render('settings', { title: 'Settings', user: req.user });
  } else {
    res.redirect("/login");
  }
});

router.post('/', function(req, res, next) {
  if(req.isAuthenticated() ) {
    User.findOne( { email : req.body.email }, function(err, user) {
      if(err) {
        req.flash("info", "There was an error.");
      } else if(user && "" + user._id !== "" + req.user._id) {
        // for some reason the users' id checks must be as strings
        req.flash("info", "That user already exists");
      } else if(req.body.password != req.body.confirmPassword) {
        req.flash("info", "Passwords must match.");
      } else {
        req.user.email = req.body.email;
        req.user.name = req.body.name;
        if(req.user.password) {
          req.user.password = User.generateHash(req.body.password);
        }
        req.user.save();
      }
      res.render('settings', { title: 'Settings', user: req.user });
    });
  } else {
      res.redirect("/login");
    }
});

module.exports = router;
