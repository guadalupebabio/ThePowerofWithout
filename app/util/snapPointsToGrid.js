/*
  Anonymizes coordinates by placing them on a 1km x 1km grid.
*/

const Distance = require('geo-distance'),
      precision = 0.002; // Grid is every 0.002 degrees

module.exports = function(lat, long){
  let latBounds = [Math.floor(lat / precision) * precision, Math.ceil(lat / precision) * precision],
      lngBounds = [Math.floor(long / precision) * precision, Math.ceil(long / precision) * precision];

  let grid = [
    [latBounds[0], lngBounds[0]],
    [latBounds[0], lngBounds[1]],
    [latBounds[1], lngBounds[1]],
    [latBounds[1], lngBounds[0]]
  ];

  let minDistance = null,
      coords = null;

  for(let [gridLat, gridLong] of grid){
    let dist = Distance.between({lat: gridLat, lon: gridLong}, {lat: lat, lon: long});
    if(minDistance == null || dist < minDistance) {
      minDistance = dist;
      coords = [gridLat, gridLong]
    }
  }

  return coords;
}
