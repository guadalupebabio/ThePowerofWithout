var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);
console.log(pointsByCountry);

var countries = $.getJSON('/countries.json', function(data){});
//var finalcountries = $.ajax(countries.responseJSON);


var attri = '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
var mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';

var token = 'pk.eyJ1IjoiY2hlcmllbW13YW5nIiwiYSI6ImNrYnIwZmkzbzJydm4yb214YW5yMThhdDQifQ.wOsnvJaOKRX6asQdqi5WrA';

//var points = !{JSON.stringify(settlements)};
console.log(typeof points); // Notice: this is an object!

//defining layergroups for data inputs
var geojson;
var settlements = L.featureGroup();
var ch = L.layerGroup();
var selection;
var selectedLayer;
var maplayer;
var populationlist = [];
var fullcircles = [];
var overlaysObj = {};
var countrieslist = [];
var continentslist = [];
var markers = L.markerClusterGroup();
//var markers = L.markerClusterGroup();


var populationCountry = 0;

var variables = [
  'Countries',
  'Settlements',
  'Settlement Data'];
var ranges = {};
var $select = $('<select></select>')
  .appendTo($('#variables'))
  .on('change', function(){
    setVariable($(this).val());
  });

for (var i = 0; i < variables.length; i++) {
  ranges[variables[i]] = { min: Infinity, max: -Infinity };
  // Simultaneously, build the UI for selecting different
  // ranges
  $('<option></option>')
    .text(variables[i])
    .attr('value', variables[i])
    .appendTo($select);
}
//add country name and population 
function checkCountries(country){
  for (var i = 0; i < countrieslist.length; ++i){
    if (countrieslist[i] === country){
      return true;
    }
  }
  countrieslist.push(country);
  return false; 
}

function checkContinents(continents){
  for (var i = 0; i < continentslist.length; ++i){
    if (continentslist[i] === continents){
      return true;
    }
  }
  continentslist.push(continents);
  console.log(continentslist);
  return false; 
  
}


for (var i = 0; i < Object.keys(pointsByCountry).length; ++i){
  for (var j = 0; j < pointsByCountry[Object.keys(pointsByCountry)[i]].length; ++j) {
    var pop = pointsByCountry[Object.keys(pointsByCountry)[i]][j]['site']['origin'].population;
      if (pop == null){
        pop = 1;
      }
       populationCountry +=pop;
      }
      
      var everypop = {};
      everypop.name = Object.keys(pointsByCountry)[i];
      
      everypop.population = populationCountry;
      populationlist.push(everypop);

      populationCountry = 0; 


    }

function circlechoose (zoomlevel){
  
  for (var i = 0; i < points.length; ++i){
    var continentcheck;
    var name = points[i]["name"];
    var population = points[i]["site"].origin["population"];
    var causes = points[i]["site"].origin["causes"];
    var country = points[i]["country"];
    var continent = points[i]["site"].origin["geolocation"];
    //var distance = getDistance([lat1, lng1], [lat2, lng2])
    
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
  
    //function createcircle(){
      var circle = L.circle(points[i]["geolocation"]["coordinates"], {
        color: col,
        fillColor: col,
        fillOpacity: 0.5,
        radius: 1000
        });
      circle.bindPopup(name + "<br>" + country + "<br>" + population + "<br>" + causes + "<br>" + continent);
      console.log("oaeifuh");
      //return circle; 
    //}
    
       markers.addLayer(circle);
  /*   if (zoomlevel == 5){
      continentcheck = checkContinents(continent);
      console.log(continentcheck);
      if (continentcheck === false){
        var circle = createcircle();
        settlements.addLayer(circle);
        //eachcircle(circle);
      }
      //settlements.addLayer();
    }
    if (zoomlevel == 6){
      countrycheck = checkCountries(country);
      console.log(countrycheck);
      if (countrycheck === false){
        settlements.removeLayer();
        console.log("hi");
        var circle1 = createcircle();
        console.log(circle1);
        settlements.addLayer(circle1);
      }
    }
    if (zoomlevel > 6){
      var circle2 = createcircle();
        settlements.addLayer(circle2);
        console.log(settlements);
    } */
  }
}
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
    "Countries": light,
    "Settlements": dark,
    "Details": satellite
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

//need to depend on population
function getColor(d) {
  return d > 15000000 ? '#800026' :
         d > 10000000  ? '#BD0026' :
         d > 5000000  ? '#E31A1C' :
         d > 1000000  ? '#FC4E2A' :
         d > 500000  ? '#FD8D3C' :
         d > 100000   ? '#FEB24C' :
         d > 0  ? '#FED976' :
                    '#FFEDA0';
}

  //legend
var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 100000, 500000, 1000000, 5000000, 10000000, 15000000],
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
  var objwanted = getObjects(populationlist, 'name', feature.properties.name);
  if (objwanted.length == 0 ){
    var popul = 0;
  }
  else{
    var popul = objwanted[0].population;
  }
  return {
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
    fillColor: getColor(popul),
    clickable: true
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

function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();//the country hover info
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
  map.addLayer(dark);
  selectedLayer = markers;
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
  });
}

 //takes out settlements when it's at satellite or light.
 //this is for now, will change later
  map.on('baselayerchange', function (e) {
      currentLayerID = e.layer._leaflet_id;
      if(e.layer._leaflet_id == 241){
        map.removeLayer(overlaysObj['settlements']);
        map.addLayer(overlaysObj['countries']);
      }
      else{
        map.addLayer(overlaysObj['settlements']);
        map.removeLayer(overlaysObj['countries']);
      }
      });

    //find value in the object that corresponds with the key. 
    function getObjects(obj, key, val) {
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(getObjects(obj[i], key, val));
            } else if (i == key && obj[key] == val) {
                objects.push(obj);
            }
        }
        return objects;
    }
    //figure out how to tie the country into layers
   $.ajax({}).done(function(data){
            
            var fh = countries.responseJSON;
     
            geojson= L.geoJson(fh, {
            pointToLayer:function(feature,latlng){
              return L.circleMarker(latlng, myStyle);
            },
            style: style,
            onEachFeature: onEachFeature
            });
            var allPointsLG = L.layerGroup([geojson]).addTo(map);
            overlaysObj["countries"] = allPointsLG;
            overlaysObj["settlements"] = markers;

            var control = L.control.layers(baseLayers, overlaysObj, {
              collapsed: false
            }).addTo(map);

           
          });
map.on('zoomend', function() {
  var zoomlevel = map.getZoom();
      if (zoomlevel  > 4){
        circlechoose(zoomlevel);

        map.addLayer(markers);
        //console.log(zoomlevel);
        //console.log("hi");
        map.addLayer(overlaysObj["settlements"]);
        map.removeLayer(light);
        map.addLayer(dark);
        if (map.hasLayer(overlaysObj["countries"])){
         map.removeLayer(overlaysObj["countries"]);
        } 
       
      }
      if (zoomlevel <= 4){
        map.removeLayer(markers);
        map.removeLayer(dark);
        map.addLayer(light);  
        map.removeLayer(overlaysObj["settlements"]);
        map.addLayer(overlaysObj["countries"]);
      }
      

      // circle cluster based on zoom
      
});
            


var legendinfo = L.control({position: 'bottomright'}); 

    legendinfo.onAdd = function (map){
      var div = L.DomUtil.create('div','info legend');
      div.id = "legendgraph";
      labels = ['<Strong>Categories</strong'],
      categories = ['General', 'Site', 'Architecture', 'Population'];

      /* for (var i = 0; i < categories.length; i++) {
        div.innerHTML +='test'
           // '<i style="background:' + getColor(labels[i] + 1) + '"></i> ' +
            //labels[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      } */
      return div;
      };
      legendinfo.addTo(map);

anychart.onDocumentReady(function(){
  var data = [
    {x: "infrastructure", value: 223553265, exploded: true},
    {x: "physicalNature", value: 38929319},
    {x: "geolocation", value: 2932248},
    {x: "Caises", value: 14674252},
    {x: "Geolocation", value: 540013},
    {x: "Population", value: 19107368}
  ];

  var test = [
    {value: 50},
    {value: 20},
    {value: 80}

  ]

  var chart = anychart.pie();

  chart.title("Demonstration of Input Data");

  chart.data(test);

  chart.container('legendgraph');
  chart.draw();
  chart.sort("desc");
  //form data of different qualities. 
  //depending on zoom level (country, settlements, continents)
  //display qualitative data percentage
});