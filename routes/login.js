var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
  if( req.isAuthenticated() ) {
    res.redirect("/home");
  } else {
    res.render('login', { title: 'Login' });
  }
});

/* Authenticate login */
router.post('/', passport.authenticate('login', {
	successRedirect: '/home',
	failureRedirect: '/login',
	failureFlash: true
	}));

module.exports = router;
