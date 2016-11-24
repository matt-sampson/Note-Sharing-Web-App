var mongoose = require('mongoose');

// Doc for Mongoose Schemas: http://mongoosejs.com/docs/guide
var Schema = mongoose.Schema;

/**
 * Note that the database was loaded with data from a JSON file into a
 * collection called gillers.
 */
var userSchema = new Schema(
    {
        username: {
            type: String, required: true, unique: true
        },
        password: {
            type: String, required: true
        },
        courses: [String],
        notes: [
            {
                code: {type: String, required: true},
                title: {type: String, required: true, index:true, unique:true, sparse:true},
            }
        ]
    },
    {
        collection: 'users'
    }
);

// Doc for Mongoose Connections: http://mongoosejs.com/docs/connections
if (!(mongoose.connection.readyState==1||mongoose.connection.readyState==2)){
    mongoose.connect('mongodb://localhost/notesdb');
}


// Doc for Mongoose Models: http://mongoosejs.com/docs/models
module.exports = mongoose.model('users', userSchema);
