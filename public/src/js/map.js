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
//console.log(typeof points); // Notice: this is an object!

//defining layergroups for data inputs
var geojson;
var selection;
var settlements = L.featureGroup();
var ch = L.layerGroup();
var maplayer;
var populationlist = [];
var fullcircles = [];
var overlaysObj = {};
var countrieslist = [];
var continentslist = [];

var finalpopulation = 0;

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




//create the map and its base layers
var light   = L.tileLayer(mbUrl, {id: 'mapbox/light-v10', maxZoom: 18, tileSize: 512, zoomOffset: -1, maxZoom: 18,
                 detectRetina: true, attribution: attri, accessToken: token}),
    dark  = L.tileLayer(mbUrl, {id: 'mapbox/dark-v10', maxZoom: 18, tileSize: 512, zoomOffset: -1, maxZoom: 18,
                 detectRetina: true, attribution: attri, accessToken: token}),
    satellite = L.tileLayer(mbUrl, {id: 'mapbox/satellite-streets-v11',maxZoom: 18,tileSize: 512, zoomOffset: -1, maxZoom: 18,
                 detectRetina: true, attribution: attri, accessToken: token});


//initializing the map
var map = L.map('map', {
    center: [0,0],
    zoom: 3,
    layers: [light, ch]
  });

var clusters = [];
//population list
for (var i = 0; i < Object.keys(pointsByCountry).length; ++i){
  for (var j = 0; j < pointsByCountry[Object.keys(pointsByCountry)[i]].length; ++j) {
    if (!(typeof pointsByCountry[Object.keys(pointsByCountry)[i]][j]['site'] === 'undefined')){

    var pop = pointsByCountry[Object.keys(pointsByCountry)[i]][j]['site']['origin'].population;
      if (pop == null){
        pop = 0;
      }
       populationCountry +=pop;
       finalpopulation +=pop;
      }
      
      var everypop = {};
      everypop.name = Object.keys(pointsByCountry)[i];
      everypop.population = populationCountry;
      everypop.causes = pointsByCountry[Object.keys(pointsByCountry)[i]][0]['site']['origin'].causes;
      populationlist.push(everypop);

      populationCountry = 0; 


    }
  }

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

var finalpop = numberWithCommas(finalpopulation);
$('#totalpop span.tpopulation').text(finalpop);

//sidebar
var sidebar = L.control.sidebar('sidebar',{
  closeButton: true,
  position: 'left'
});

map.addControl(sidebar);

// adds every circle marker into marker layer
for (var i = 0; i < points.length; ++i){
    //var continentcheck;
    
    if (!(typeof points[i]["site"] === 'undefined')){
      var name = points[i]["name"];
      console.log(name);
    
      var population = points[i]["site"].origin["population"];
      var causes = points[i]["site"].origin["causes"];
      var country = points[i]["country"];
      var continent = points[i]["site"].origin["geolocation"];
    
      if (population == null){
        var rad = 20;
      }
      else{
        if (population > 10000000){
          var rad = population/200000;
        }
        else if (population <= 10000000 && population >= 1000000){
          var rad = population/50000;
        }
        else if (population < 1000000 && population >= 100000){
          var rad = population/10000;
        }
        else if (population < 100000 && population >= 10000){
          var rad = population/300;
        }
        else if (population < 10000 && population >= 1000){
          var rad = population/100;
        }
        else{
          var rad = population/10;
        }
      }
      if (causes != null){
        //colour of circles based on causes 
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
      }
      
  
      //initializing the circles;
      var circle = L.circleMarker(points[i]["geolocation"]["coordinates"], {
          color: col,
          fillColor: col,
          fillOpacity: 0.5,
          radius: rad
          });

      sidebar.setContent("Settlement Name");
      circle.on('click', function(){
        sidebar.show();
      });

      
      
      checkCountries(country); //adds country into list if not there already
      
      addclustergroup(country, circle); //adds the circle into a clustergroup based on the country
      //markers.addLayer(circle);
        }
    }
    
    
    


//check if they're in the same country
function checkCountries(country){
  for (var i = 0; i < countrieslist.length; i++){
    if (countrieslist[i] === country){
      return true;
    }
  }
  countrieslist.push(country);
  var colorchosen = populationlist[i].causes;
  clusters[i] = L.markerClusterGroup({
    
    iconCreateFunction: function(cluster){
      if (colorchosen === "Squatting"){
        return L.divIcon({
          html: '<b>' + cluster.getChildCount() + '</b>',
          className: 'circle-icon',
          iconSize: [editradius(populationlist[i].population), editradius(populationlist[i].population)]
        });
      }
      if (colorchosen === "Refugee Camp"){
        return L.divIcon({
          html: '<b>' + cluster.getChildCount() + '</b>',
          className: 'circle-icon4',
          iconSize: [editradius(populationlist[i].population), editradius(populationlist[i].population)]
        });
      }
      if (colorchosen === "Illegal Subdvision"){
        return L.divIcon({
          html: '<b>' + cluster.getChildCount() + '</b>',
          className: 'circle-icon3',
          iconSize: [editradius(populationlist[i].population), editradius(populationlist[i].population)]
        });
      }
      else{
        return L.divIcon({
          html: '<b>' + cluster.getChildCount() + '</b>',
          className: 'circle-icon2',
          iconSize: [editradius(populationlist[i].population), editradius(populationlist[i].population)]
        });
      }
      
    }
  });
  return false; 
}

function editradius(input){
  if (input <20 ){
    return 20;
  }
  else{
    if (input > 10000000){
      return (input/200000);
    }
    if (input <= 10000000 && input >= 1000000){
      return (input/50000);
    }
    if (input < 1000000 && input >= 100000){
      return (input/10000);
    }
    if (input < 100000 && input >= 10000){
      return (input/500);
    }
    if (input < 10000 && input >= 1000){
      return (input/100);
    }
    else{
      return (input/10);
    }
  }
}


function addclustergroup(countryinput, circlemark){
  for (var i = 0; i < countrieslist.length; i++){
    if (String(countrieslist[i]) === String(countryinput)){
      clusters[i].addLayer(circlemark);
    }
  }
}



var baseLayers = {
  "Countries": light,
  "Settlements": dark,
  "App Map": satellite
};

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

//colour depending on population
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

//legend for population
var legend = L.control({position: 'bottomleft'});
    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
      popvalues = [0, 100000, 500000, 1000000, 5000000, 10000000, 15000000],
      labels = ['<strong> Population of Settlements in each Country </strong> <br>'];
      labels.push(
        '<i style="background:' + getColor(-1) + '"></i> ' + 
        ('no settlements recorded'+ '<br>'));
    for (var i = 0; i < popvalues.length; i++){
      from = popvalues[i];
      to = popvalues[i+1];
    
    
    labels.push(
      '<i style="background:' + getColor(from + 1) + '"></i> ' +
     from + (to ? '&ndash;' + to + '<br>' : '+'));    
    }

    div.innerHTML = labels.join('\n');
    return div;

};

legend.addTo(map);


//style for countries
function style(feature) {
  var objwanted = getObjects(populationlist, 'name', feature.properties.name);
  if (objwanted.length == 0){
      var popul = -1;
 }
  else{
    if(objwanted[0].population == 0){
      var popul = 1;
    }
    else{
    var popul = objwanted[0].population;
    }
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
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
  });
}

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

//country outline into geojson
$.ajax({}).done(function(data){
            
  var fh = countries.responseJSON;
  geojson= L.geoJson(fh, {
              pointToLayer:
              function(feature,latlng){
                return L.circleMarker(latlng, myStyle);
            },
              style: style,
              onEachFeature: onEachFeature
            });
            var allPointsLG = L.layerGroup([geojson]).addTo(map);
              overlaysObj["countries"] = allPointsLG;
              
             //overlaysObj["settlements"] = settlements;

            

           
});




//sidebar controls, open when clicked
/*
for (var i = 0; i < clusters.length; i ++){
  for(var j = 0; j < clusters[i].length; j++){
    clusters[i][j]
  }
};
*/

function addtoMap(){
  for (var i = 0; i < clusters.length; i ++){
    map.addLayer(clusters[i]);
  }
}

function removefromMap(){
  for (var i = 0; i < clusters.length; i ++){
    map.removeLayer(clusters[i]);
  }
}
//map zooming
function changeoflayers(layout){
  if (layout === "settlement"){
    //altermarkers();
    info.remove();
    addtoMap();
    map.removeLayer(light);
    map.addLayer(dark);
    legend.remove(map);
    if (map.hasLayer(overlaysObj["countries"])){
      map.removeLayer(overlaysObj["countries"]);
      } 
    }
    if (layout === "country"){
      sidebar.hide();
      removefromMap();
      legend.addTo(map);
      map.removeLayer(dark);
      map.addLayer(light);  
      map.addLayer(overlaysObj["countries"]);
    } 
  };

/* 
map.on('baselayerchange', function(a){
  console.log("the layer changed to " + a.name);
  if (a.name === "Settlements"){
    //altermarkers();
    addtoMap();
    map.removeLayer(light);
    map.addLayer(dark);
    legend.remove(map);
    if (map.hasLayer(overlaysObj["countries"])){
      map.removeLayer(overlaysObj["countries"]);
    } 
  }
  if (a.name === "Countries"){
    removefromMap();
    legend.addTo(map);
    map.removeLayer(dark);
    map.addLayer(light);  
    map.addLayer(overlaysObj["countries"]);
  }
}) */

var defaultClusters = clusters;

var allrad = [];

$("#buttonnavigate").on("click", function(event){
  $('.country').removeAttr('id');
  $('.country').attr('id','notclicked');
  $('.settlement').removeAttr('id');
  $('.settlement').attr('id','notclicked');
  $(event.target).attr('id', 'clicked');
  changeoflayers($(event.target).attr('class'));
});


// for (var i = 0; i < defaultClusters.length; i++){
//   var radoverall = [];
//   for (var j = 0; j < defaultClusters[i]._needsClustering.length; j++){
//     var currentrad = defaultClusters[i]._needsClustering[j]._mRadius;
//     radoverall[j] = currentrad;
//   }
//   allrad[i] = radoverall;
// }

//altermarkers(); 



 //pie charts
/* var legendpie = L.control({position: 'bottomright'}); 

legendpie.onAdd = function (map){
      var div = L.DomUtil.create('div','info legend');
      div.id = "legendgraph";
      labels = ['<Strong>Categories</strong'],
      categories = ['General', 'Site', 'Architecture', 'Population'];
      return div;
};

legendpie.addTo(map);

anychart.onDocumentReady(function(){
  var data = [
    {x: "Infrastructure", value: 223553265, exploded: true},
    {x: "PhysicalNature", value: 38929319},
    {x: "Geolocation", value: 2932248},
    {x: "Causes", value: 14674252},
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

//alter the markerclustergroups  */