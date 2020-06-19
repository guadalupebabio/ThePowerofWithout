var map = L.map('map')
  .setView([0,0],3);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(map);

function goToSection(i){
  $(".column:first-child a").removeClass("active");
  $("form section").addClass("is-hidden");
  $(".column:nth-child(3) section").addClass("is-hidden");

  $(".column:first-child a:nth-of-type(" + i + ")").addClass("active");
  $("form section:nth-of-type(" + i + ")").removeClass("is-hidden");
  $(".column:nth-child(3) section:nth-of-type(" + i + ")").removeClass("is-hidden");
}

var marker = null;

map.on('click',function(e){
   lat = e.latlng.lat;
   lon = e.latlng.lng;

   console.log(marker == null);

   if(marker == null) marker = L.marker([lat,lon]).addTo(map);
   else marker.setLatLng(e.latlng);

   $("#coords").val(`${lat.toFixed(5)}, ${lon.toFixed(5)}`)
});
