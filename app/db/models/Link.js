/*
  Comment.js
  Stores a form link
*/

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let linkSchema = new Schema({
  email: String,
  settlementId: String,
  formFieldName: String,
  link: String
});

module.exports = function(conn){
  return conn.model('Link', linkSchema);
}
