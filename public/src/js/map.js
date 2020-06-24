var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

var countries = $.getJSON('/countries.json', function(data){});
//var finalcountries = $.ajax(countries.responseJSON);


var attri = '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
var mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';

var token = 'pk.eyJ1IjoiY2hlcmllbW13YW5nIiwiYSI6ImNrYnIwZmkzbzJydm4yb214YW5yMThhdDQifQ.wOsnvJaOKRX6asQdqi5WrA';

//var points = !{JSON.stringify(settlements)};
console.log(typeof points); // Notice: this is an object! 

//defining layergroups for data inputs
var settlements = L.featureGroup();
var ch = L.layerGroup();

//inputting data
for (var i = 0; i < points.length; ++i){
  var name = points[i]["name"];
  var population = points[i]["site"].origin["population"];
  var causes = points[i]["site"].origin["causes"];
  var country = points[i]["country"];
  var continent = points[i]["site"].origin["geolocation"];

  if (population == null){
    var rad = 90000;
  }
  else{
    var rad = points[i]["site"].origin["population"]/20;
  }

  //circle colours and size
  if (causes.localeCompare("Squatting")==0){
    var col = '#FC4E2A';
  }
  else if (causes.localeCompare("Refugee Camp")==0){
    var col = 'blue';
  }
  else if (causes.localeCompare("Illegal Subdivision")==0){
    var col = 'green';
  }
  else{
    var col = 'orange';
  }

  var circle = L.circle(points[i]["geolocation"]["coordinates"], {
  color: col,
  fillColor: col,
  fillOpacity: 0.5,
  radius: rad
  });
  circle.bindPopup(name + "<br>" + country + "<br>" + population + "<br>" + causes + "<br>" + continent);
 
  settlements.addLayer(circle);
  };

  //create the map and its base layers

  var light   = L.tileLayer(mbUrl, {id: 'mapbox/light-v10', maxZoom: 18, tileSize: 512, zoomOffset: -1, maxZoom: 18,
                 detectRetina: true, attribution: attri, accessToken: token}),
      dark  = L.tileLayer(mbUrl, {id: 'mapbox/dark-v10', maxZoom: 18, tileSize: 512, zoomOffset: -1, maxZoom: 18,
                 detectRetina: true, attribution: attri, accessToken: token}),
      satellite = L.tileLayer(mbUrl, {id: 'mapbox/satellite-streets-v11',maxZoom: 18,tileSize: 512, zoomOffset: -1, maxZoom: 18,
                 detectRetina: true, attribution: attri, accessToken: token});
  


  var map = L.map('map', {
    center: [0,0],
    zoom: 3,
    layers: [light, ch]
  });

  var baseLayers = {
    "light": light,
    "dark": dark,
    "satellite": satellite
  };

  var overlays = {
    "settlements": settlements,
    "countries": ch
  };

  
  //control that shows population information on hover
  var info = L.control();

  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
  };

  info.update = function (value) {
    this._div.innerHTML = '<h4>US Population living in informal settlements* </h4>' + value
    '<br>Informality index</br>';
  };

  info.addTo(map);


function getColor(d) {
    return d > 1000 ? '#800026' :
          d > 500  ? '#BD0026' :
          d > 200  ? '#E31A1C' :
          d > 100  ? '#FC4E2A' :
          d > 50   ? '#FD8D3C' :
          d > 20   ? '#FEB24C' :
          d > 10   ? '#FED976' :
                      '#FFEDA0';
}

  //legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 10, 20, 50, 100, 200, 500, 1000],
    labels = [];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
}

return div;
};

legend.addTo(map);


//zooming 
function style(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
    fillColor: getColor(feature.properties.density)
  };
}

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

  info.update(layer.feature.properties.name);
}

var geojson;

function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();//the country hover info 
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
  map.addLayer(dark);
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
  });
}
L.control.layers(baseLayers, overlays).addTo(map);
 
 //takes out settlements when it's at satellite or light.    
 //this is for now, will change later
  map.on('baselayerchange', function (e) {
      currentLayerID = e.layer._leaflet_id;
      console.log(currentLayerID); 
      if(e.layer._leaflet_id == 280 || e.layer._leaflet_id == 241){
        map.removeLayer(overlays['settlements']);
      }
      else{
        map.addLayer(overlays['settlements']);
      }
      });


    //figure out how to tie the country into layers 
    $.ajax({}).done(function(data){
            var fh = countries.responseJSON;
            geojson = L.geoJson(fh, {
            style: style,
            onEachFeature: onEachFeature
            }).addTo(map);
          });

          //onclick function
   // settlements.on("click", function(){
                
    //});

    $(settlements).click(function() {
        console.log("clicked");
        //not yet working:
        //map.addLayer(light);
        //map.removeLayer(light);
        //map.removeLayer(dark);
     //   zoomToFeature;  
    });
           
        

//- map.removeLayer(overlays['settlements']);
//- map.on('layerremove', function(event) {
//-     if(event.layer == ch) {
//-          $.ajax({}).done(function(data){
//-           var fh = countries.responseJSON;
//-           geojson = L.geoJson(fh, {
//-             style: style,
//-             onEachFeature: onEachFeature
//-           }).addTo(map);
//-           });
//-     }
//- });

//- map.on('layeradd', function(event) {
//-     if(event.layer == ch) {
//-        console.log("bad");
//-     }
//- });