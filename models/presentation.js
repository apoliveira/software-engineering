
var presentationSchema = new mongoose.Schema({
	_id:		mongoose.Schema.Types.ObjectId,
	author_id:	mongoose.Schema.Types.ObjectId,
	title: 		String,
	pdf_path: 	String
});

presentationSchema.statics.getByAuthor = function(author, next) {
  return this.model("Presentation").find( { _id : author._id }, next );
}

var Presentation = mongoose.model("Presentation", presentationSchema);

module.exports = Presentation;
