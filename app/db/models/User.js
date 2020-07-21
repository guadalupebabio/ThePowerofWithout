/*
  User.js
  Stores a user-settlement they created pair
*/

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let userSchema = new Schema({
  email: String,
  contribution: String,
  secret: String
});


module.exports = mongoose.model('User', userSchema);
