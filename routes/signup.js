var express = require('express');
var router = express.Router();

/* GET signup page. */
router.get('/', function(req, res, next) {
  if( req.isAuthenticated() ) {
    res.redirect("/home");
  } else {
    res.render('signup', { title: 'Sign Up' });
  }
});

/* POST signup page. */
router.post('/', passport.authenticate('signup', {
	successRedirect: '/home',
	failureRedirect: '/signup',
	failureFlash: true}));

module.exports = router;
