const mongoose = require('mongoose');

// This schema defines what a user document looks like in MongoDB.
const userSchema = new mongoose.Schema({
   username: {
      type: String,
      required: true,
      unique: true,
   },
   email: {
      type: String,
      required: true,
      unique: true,
   },
   password: {
      type: String,
      required: true,
   },
   role: {
      type: String,
      enum: ['user', 'artist'],
      default: 'user',
   },
});

// Create the User model from the schema.
const userModel = mongoose.model('user', userSchema);
module.exports = userModel;