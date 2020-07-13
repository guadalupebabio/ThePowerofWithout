/*
  User.js
*/

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let userSchema = new Schema({
  email: String,
  name: String,
  contributions: [String],
});


module.exports = mongoose.model('User', userSchema);
