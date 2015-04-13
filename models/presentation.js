
var presentationSchema = new mongoose.Schema({
	_id:		mongoose.Schema.Types.ObjectId,
	author_id:	mongoose.Schema.Types.ObjectId,
	title: 		String,
	pdf_path: 	String
});

var Presentation = mongoose.model("Presentation", presentationSchema);

module.exports = Presentation;
