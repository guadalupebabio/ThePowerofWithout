/*
  Pin.js
  Stores pins created by 3rd party app
*/

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let pinSchema = new Schema({
  pin: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  type: String,
  createdAt: Date,
  updatedAt: Date
});

module.exports = function(conn){
  return conn.model('Pin', pinSchema);
}
