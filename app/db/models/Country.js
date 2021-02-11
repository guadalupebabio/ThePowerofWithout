/*
  country.js
  Represents the data for one informal country
*/

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;


let countrySchema = new Schema({
  type: String,
  id: String,
  properties: {
    name: String
  },
  geometry: {
    type: String,
    coordinates: {
      type: Array
    },
  },
});

module.exports = function(conn){
  return conn.model('countries', countrySchema);
}
