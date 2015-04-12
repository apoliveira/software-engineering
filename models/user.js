var bcrypt = require("bcrypt");
var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
	_id:		mongoose.Schema.Types.ObjectId,
	name: 		String,
	email: 		String,
	password: 	String
});

userSchema.statics.generatePassword = function(password) {
	return bcrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

userSchema.methods.validPassword = function(password) {
	return User.generatePassword(password) == this.password;
}

var User = mongoose.model("User", userSchema);

module.exports = User;
