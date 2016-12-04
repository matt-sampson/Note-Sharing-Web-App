var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

// Doc for Mongoose Schemas: http://mongoosejs.com/docs/guide
var Schema = mongoose.Schema;

/**
 * Note that the database was loaded with data from a JSON file into a
 * collection called gillers.
 */
var noteSchema = new Schema(
	{
		uploader: {
			type: String, required: true
		},
		code: {
			type: String, required: true
		},
		title: {
			type: String, required: true, index: true, unique: true, sparse: true
		},
		text: {
			type: String,
		}
	},
	{
		collection: 'notes'
	}
);
 
// Doc for Mongoose Connections: http://mongoosejs.com/docs/connections
if (!(mongoose.connection.readyState==1||mongoose.connection.readyState==2)){
    mongoose.connect('mongodb://localhost/notesdb');
}
// Doc for Mongoose Models: http://mongoosejs.com/docs/models
module.exports = mongoose.model('note', noteSchema);