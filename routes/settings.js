var express = require('express');
var router = express.Router();

/* GET settings page. */
router.get('/', function(req, res, next) {
    if(req.isAuthenticated() ) {
      res.render('settings', { title: 'Settings' });
    } else {
      res.redirect("/signup");
    {
});

module.exports = router;
