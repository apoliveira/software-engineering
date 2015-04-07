
var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
	_id:		mongoose.Schema.Types.ObjectId,
	name: 		String,
	email: 		String,
	password: 	String
});

var User = mongoose.model("User", userSchema);

module.exports = User;
