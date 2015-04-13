var bcrypt = require("bcrypt");

var userSchema = new mongoose.Schema({
	name: 		String,
	email: 		String,
	password: 	String
});

userSchema.statics.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
}

var User = mongoose.model("User", userSchema);

module.exports = User;
