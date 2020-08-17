

var map = L.map('map')
  .setView([20.7643795,-103.3579886],16);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(map);

var array = [];

pins = pins.map(function(pin){
  return new L.Marker(pin.pin.coordinates);
})

L.featureGroup(pins).addTo(map);
