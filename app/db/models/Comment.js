/*
  Comment.js
  Stores a form comment
*/

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let commentSchema = new Schema({
  email: String,
  settlementId: String,
  formFieldName: String,
  comment: String
});

module.exports = function(conn){
  return conn.model('Comment', commentSchema);
}
