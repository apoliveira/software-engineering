var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
	req.logout();
	res.redirect('/login');
});

module.exports = router;
