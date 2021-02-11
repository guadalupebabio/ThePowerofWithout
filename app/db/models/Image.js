/*
  Image.js
  Stores a form image url
*/

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let imageSchema = new Schema({
  email: String,
  settlementId: String,
  formFieldName: String,
  imageUrl: Array
});

module.exports = function(conn){
  return conn.model('Image', imageSchema);}