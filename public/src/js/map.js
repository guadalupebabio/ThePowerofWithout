var script = document.createElement('script');
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

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
var ch = L.layerGroup();
var pinslayer = L.layerGroup();
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

var examplelist = [];
  
var exam = countrydata;

for (var i = 0; i <exam.length; i++){
  var eachex = {};
  eachex.name = exam[i].Aruba;
  eachex.population = exam[i].__54;
  examplelist.push(eachex);
}

//check how many same pairs
var pinsclusters = [];

for (var i = 0; i < pins.length; i++){
  checkpins(pins[i]);
}

function checkpins(pinspec){
  var pinplace = {};
  for (var i = 0; i < pinsclusters.length; i++){
    if (pinsclusters[i].coordinates[0] == pinspec.pin["coordinates"][0] && 
      pinsclusters[i].coordinates[1] == pinspec.pin["coordinates"][1]){
      pinsclusters[i].number += 1;
      return true;
    }
  }
  pinplace.coordinates = pinspec.pin["coordinates"];
  pinplace.number = 1;
  pinsclusters.push(pinplace);
  return false
}

//create the map and its base layers
var dark2  = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                          subdomains: 'abcd',
                          maxZoom: 19});
    dark  = L.tileLayer(mbUrl, {id: 'mapbox/dark-v10', maxNativeZoom:19, maxZoom:25, tileSize: 512, zoomOffset: -1, maxZoom: 18,
                 detectRetina: true, attribution: attri, accessToken: token})


//initializing the map
var map = L.map('map', {
    center: [0,0],
    zoom: 3,
    layers: [dark, ch]
  });

var finalpins = pins.map(function(p){
  for (var i = 0; pins.length; p++){
    return pins[i].pin["coordinates"];
  }
    
  
})
//var heat = L.heatLayer((finalpins),{radius:30});

var clusters = [];
//population list
for (var i = 0; i < Object.keys(pointsByCountry).length; ++i){
  for (var j = 0; j < pointsByCountry[Object.keys(pointsByCountry)[i]].length; ++j) {

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
    populationlist.push(everypop);

    populationCountry = 0; 


    
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


//Map pins Data
for (var i = 0; i < pins.length; ++i){
  var type = pins[i].type;

  if (type != null){
    //colour of circles based on causes 
    if (type === "safety"){
      var colpin = '#FC4E2A';
    }
    else if (type === "maintenance"){
      var colpin = 'blue';
    }
    else if (type === "ilumination"){
      var colpin = 'green';
    }
  }

  var circle = L.circleMarker(pins[i].pin["coordinates"], {
    time: pins[i].updatedAt,
    color: colpin,
    fillColor: colpin,
    fillOpacity: 0.5,
    radius: 5
    });
  
  circle.addTo(pinslayer);
};
var sliderControl = null;


//create legend for app map
var legendapp = L.control({position: 'bottomright'});
    legendapp.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        popvalues = ['safety', 'maintenance', 'illumination'],
        labeling = ['<strong> Types of Pin </strong> <br>'];
      labeling.push(
        '<i style="background:' + "#FC4E2A" + '"></i> ' + popvalues[0] + '<br>' 
      + '<i style="background:' + 'blue' + '"></i> '+ popvalues[1] + '<br>'
      + '<i style="background:' + 'green' + '"></i> ' + popvalues[2] + '<br>');
    div.innerHTML = labeling.join('\n');
    return div;

};



sliderControl = L.control.sliderControl({
  position: "topright",
  layer: pinslayer,
  range: true
})
// adds every circle marker into marker layer
for (var i = 0; i < points.length; ++i){
    //var continentcheck;

    if (!(typeof points[i]["site"] === 'undefined')){
      var name = points[i]["name"];
    
      var population = points[i]["site"].origin["population"];
      var causes = points[i]["site"].origin["causes"];
      var country = points[i]["country"];
      var continent = points[i]["site"].origin["geolocation"];
      if (causes == ""){
        var finalcauses = "unknown";
        
      }
      else{
        var finalcauses = causes;
      }
      if (population == null){
        var rad = 20;
        var col = getColor(0);
        var finalpop = "unknown";
      }
      else{
        var col = getColor(population);
        var finalpop = population;
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
      /* if (causes != null){
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
      } */
  
      //initializing the circles;
      var circle = new L.CircleMarker(points[i]["geolocation"]["coordinates"], {
          color: col,
          fillColor: col,
          fillOpacity: 0.5,
          radius: rad
          }).on("click", circleClick);

      circle.options.name = name;
      circle.options.country = country;
      circle.options.continent = continent;
      circle.options.finalcauses = finalcauses;
      circle.options.finalpop = finalpop;

      checkCountries(country); //adds country into list if not there already

      addclustergroup(country, circle); //adds the circle into a clustergroup based on the country
      //markers.addLayer(circle);
        }
    }

var origins = ["Topography", "Within Cities", "Weather", "Security"];
var architectures = ["House Quality", "Materials", "Development State", "Access to Energy", "Access to Water", "Access to Sanitation", "Access to Internet or Phone Fare", "Mobility Systems", "Elevation"];
var populaces = ["Health Care", "Number of Hospitals, Clinics, or Health Cares", "Education", "Number of Schools", "Proximity to Public Areas or Leisure Activities", "Unemployment Rate", "Ownernship", "Ethic and Racial Categories"];
function updateDataInSidebar(name, country, continent, finalcauses, finalpop) {
  var wcauses = "Causes";
  var wpop = "Population"
  sidebar.setContent(
    "<span class = \"name\">" + name.toUpperCase() + "</span>" + "<br>" +
    "<span class = \"country\">" + country + ", " + continent + "</span>" +  "<br>" + "<br>" + "<br>" +
    "<span class = \"labels\">ORIGIN</span>" + "<br>" +  "<br>" +
    "<span class = \"tags\">" + wcauses.bold() + ": " + finalcauses + "</span>"  + 
    "<span class = \"tags\">" + wpop.bold() + ": " + finalpop + "</span>" + 
    createspans(origins) +  "<br>" +
    "<span class = \"labels\">ARCHITECTURE</span>" + "<br>" + "<br>" + "<br>" + 
    createspans(architectures)+ "<br>"+
    "<span class = \"labels\">POPULACE </span>" + "<br>"+ "<br>" + "<br>" +
    createspans(populaces) + "<br>"
    );
}

function createspans(array){
  var finalspan = "";
  for (var i = 0; i < array.length; i++){
    finalspan += "<span class = \"tags\">" + array[i].bold() + ": unknown" + "</span>" 
  }
  return finalspan; 
}

//check for attributes
function circleClick(e){
  var clickedCircle = e.target.options;
  var name = clickedCircle.name;
  var country = clickedCircle.country;
  var continent = clickedCircle.continent;
  var finalcauses = clickedCircle.finalcauses;
  var finalpop = clickedCircle.finalpop;
  sidebar.show();
  updateDataInSidebar(name, country, continent, finalcauses, finalpop);
}
    
//check if they're in the same country
function checkCountries(country){
  for (var i = 0; i < countrieslist.length; i++){
    if (countrieslist[i] === country){
      return true;
    }
  }
  countrieslist.push(country);
  var obj = populationlist[i].population;
  clusters[i] = L.markerClusterGroup({
    iconCreateFunction: function(cluster){
      if (obj > 15000000){
        return L.divIcon({
          html: '<b>' + cluster.getChildCount() + '</b>',
          className: 'circle-icon',
          iconSize: [editradius([obj]), editradius(obj)]
        })
      }
      if (obj > 10000000){
        return L.divIcon({
          html: '<b>' + cluster.getChildCount() + '</b>',
          className: 'circle-icon2',
          iconSize: [editradius(obj), editradius(obj)]
        })
      }
      if (obj > 5000000){
        return L.divIcon({
          html: '<b>' + cluster.getChildCount() + '</b>',
          className: 'circle-icon3',
          iconSize: [editradius(obj), editradius(obj)]
        })
      }
      if (obj > 1000000){
        return L.divIcon({
          html: '<b>' + cluster.getChildCount() + '</b>',
          className: 'circle-icon4',
          iconSize: [editradius(obj), editradius(obj)]
        })
      }
      if (obj >  500000){
        return L.divIcon({
          html: '<b>' + cluster.getChildCount() + '</b>',
          className: 'circle-icon5',
          iconSize: [editradius(obj), editradius(obj)]
        })
      }
      if (obj >  100000 ){
        return L.divIcon({
          html: '<b>' + cluster.getChildCount() + '</b>',
          className: 'circle-icon6',
          iconSize: [editradius(obj), editradius(obj)]
        })
      }
      if (obj >= 0){
        return L.divIcon({
          html: '<b>' + cluster.getChildCount() + '</b>',
          className: 'circle-icon7',
          iconSize: [editradius(obj), editradius(obj)]
        })
      }
     
      
    /*  if (colorchosen === "Squatting"){
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
    */  
    }
  });
  return false;
}

//creating markers
for (var i = 0; i < countrieslist.length; i++){
  
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


var info = L.control();

  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
  };

  info.update = function (value, pop) {
    if (pop == 0){
      this._div.innerHTML = '<h4>Population living in slums (% of urban population)</h4>' + value + ': no specific population at this slum';
    }
    else if (pop == -1){
      this._div.innerHTML = '<h4>Population living in slums (% of urban population)</h4>' + value + ': no recorded slums here';
    }
    else{
      this._div.innerHTML = '<h4>Population living in slums (% of urban population)</h4>' + value + ": " 
      + pop;
      }
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
         d >= 0  ? '#FED976' :
                    '#202020';
}

function getColorex(d){
  return d > 90 ? '#800026' :
         d > 75  ? '#BD0026' :
         d > 60  ? '#E31A1C' :
         d > 45  ? '#FC4E2A' :
         d > 30 ? '#FD8D3C' :
         d > 15   ? '#FEB24C' :
         d >= 0  ? '#FED976' :
                    '#202020';
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

//legend.addTo(map);

//style for countries
function style(feature) {
  
    var objexwanted = getObjects(examplelist, 'name', feature.properties.name);
      if (objexwanted.length == 0 || objexwanted[0].population === ""){
        var populex = -1;
  }
    else{
      var populex = objexwanted[0].population;
      }
  

    var objwanted = getObjects(populationlist, 'name', feature.properties.name);
    if (objwanted.length == 0){
        var popul = -1;
   }
    else{
      var popul = objwanted[0].population;
   }
    //for the demo data 
  
    return {
      weight: 2,
      opacity: 1,
      color: 'black',
      dashArray: '3',
      fillOpacity: 0.7,
      fillColor: getColorex(populex),
      clickable: true
    };
}

function highlightFeature(e) {
  var layer = e.target;
  var popwanted = getObjects(populationlist, 'name', layer.feature.properties.name);
  var popwantedex = getObjects(examplelist, 'name', layer.feature.properties.name);
  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
 

  info.update(layer.feature.properties.name, returnspopulationex(popwantedex));
}

function returnspopulation(list){
  var popreturn= 0;
  if (list.length === 0){
    return -1;
  }
  for (var i = 0; i < list.length; i++){
    popreturn += list[i].population;
  }
  return popreturn;

}

function returnspopulationex(list){
  if (list.length == 0 || list[0].population === ""){
    return -1;
}
  else{
    return list[0].population;
  }
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
    map.addLayer(dark);
    //legend.remove(map);
    map.removeLayer(dark2);
    legendapp.remove(map);
    sliderControl.remove();
    map.setView([0,0], 3);
    map.removeLayer(pinslayer);
    if (map.hasLayer(overlaysObj["countries"])){
      map.removeLayer(overlaysObj["countries"]);
      }
    }
    if (layout === "country"){
      sidebar.hide();
      info.addTo(map); 
      removefromMap();
      //legend.addTo(map);
      legendapp.remove(map);
      map.addLayer(dark);  
      map.setView([0,0], 3);
      sliderControl.remove();
      
      map.removeLayer(dark2);
      map.removeLayer(pinslayer);
      map.addLayer(overlaysObj["countries"]);

    } 
    if (layout === "appdata"){
      map.setView([20.7643795,-103.3579886],16);
      sidebar.hide();
      map.removeLayer(dark);
      map.addLayer(dark2);
      if (map.hasLayer(overlaysObj["countries"])){
        map.removeLayer(overlaysObj["countries"]);
      } 
      info.remove();
      map.addLayer(pinslayer); //displays every point
      map.addControl(sliderControl); //adjust points of interest
      sliderControl.startSlider();
      legend.remove(map);
      removefromMap();
      legendapp.addTo(map);
      
     
      
    }
  };


map.on('baselayerchange', function(a){
  console.log("the layer changed to " + a.name);
}) 

var defaultClusters = clusters;

var allrad = [];

$("#buttonnavigate").on("click", function(event){
  $('.country').removeAttr('id');
  $('.country').attr('id','notclicked');
  $('.appdata').removeAttr('id');
  $('.appdata').attr('id', 'notclicked');
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
