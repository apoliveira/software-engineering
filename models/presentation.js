
var presentationSchema = new mongoose.Schema({
	author_id:	{ type: mongoose.Schema.ObjectId, ref: 'User' },
	title: 		String,
	pdf_path: 	String
});

presentationSchema.statics.getByAuthor = function(author, next) {
  return this.model("Presentation").find( { author_id : author._id }, next );
}

var Presentation = mongoose.model("Presentation", presentationSchema);

module.exports = Presentation;
