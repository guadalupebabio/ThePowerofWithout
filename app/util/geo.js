/*
  Converts coordinates to country they are contained in
*/

const countryGeojson = require('@geo-maps/countries-land-10m')(),
      gju = require('geojson-utils'),
      countries = require("i18n-iso-countries");

function getCountry(lat, lon){
  let point = {"type":"Point", "coordinates": [lon, lat]};

  for(let i = 0; i < countryGeojson.features.length; i++){
    if(gju.pointInPolygon(point, countryGeojson.features[i].geometry)) return countries.getName(countryGeojson.features[i].properties.A3, "en");
  }

  return null;
}

module.exports = {
  getCountry: getCountry
}
