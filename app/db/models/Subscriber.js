/*
  Subscriber.js
  Stores a user subscription
*/

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let subSchema = new Schema({
  email: String,
  subscribed:{
    type:Boolean,
    default:false,
  }
});

module.exports = function(conn){
  return conn.model('Subscriber', subSchema);
}
