const mongoose = require('mongoose');

require('dotenv').config();

/**
 * -------------- DATABASE ----------------
 */

/**
 * Connect to MongoDB Server using the connection string in the `.env` file.  To implement this, place the following
 * string into the `.env` file
 * 
 * DB_STRING=mongodb://<user>:<password>@localhost:27017/database_name
 */ 

const conn = process.env.DB_STRING;

const connection = mongoose.createConnection(conn, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    hash: String,
    salt: String,
    member: Boolean,
    admin: Boolean,
});

UserSchema.virtual("url").get(function() {
    
    return `/user/dashboard/${this._id}`;
    
})

// Create a simple schema for a Message. 
const MessageSchema = new mongoose.Schema({
    title: String,
    timestamp: Date,
    text: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
})

const User = connection.model('User', UserSchema);
const Message = connection.model('Message', MessageSchema);

// Expose the connection
module.exports = connection;
