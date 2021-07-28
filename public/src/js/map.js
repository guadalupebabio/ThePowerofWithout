var script = document.createElement('script');
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

//var countries = $.getJSON('/countries.json', function(data){});
var countries = fetch('/api/countries')
var settlements = fetch('/api/settlements')
//pins?

//var finalcountries = $.ajax(countries.responseJSON);


{
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
  var settlementslayer = L.layerGroup();
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
  /*var dark2  = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                            subdomains: 'abcd',
                            maxZoom: 19});*/
    var dark2  = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png', {
                            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                            subdomains: 'abcd',
                            maxZoom: 19});
      dark  = L.tileLayer(mbUrl, {id: 'mapbox/dark-v10', maxNativeZoom:19, maxZoom:25, tileSize: 512, zoomOffset: -1, maxZoom: 18,
                  detectRetina: true, attribution: attri, accessToken: token})
      //Add Satellite Map
      googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{ maxNativeZoom:19, maxZoom:25, subdomains:['mt0','mt1','mt2','mt3'], tileSize: 512, zoomOffset: -1, maxZoom: 18,
      detectRetina: true, attribution: attri, accessToken: token});

  //initializing the map
  var map = L.map('map', {
      center: [0,0],
      zoom: 3,
      layers: [dark, ch, googleSat]
    });

  //Add Layer Control UI
  var baseMaps = {
    "Default": dark2,
    "Satellite": googleSat
  };

  //Draw Layer control UI
  L.control.layers(baseMaps).addTo(map);

  var finalpins = pins.map(function(p){
    for (var i = 0; pins.length; p++){
      return pins[i].pin["coordinates"];
    }
      
    
  })

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
  var sliderControl2 = null;


//Settlement pins [WIP]
//console.log(points[0]["geolocation"]["coordinates"])
/*
for (var i = 0; i < settlements.length; ++i){
  var circle = L.circleMarker(settlements[i]["geolocation"]["coordinates"], {
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
  circle.addTo(settlementslayer);
};*/
settlements.then(response => response.json())
      .then(data => {
        console.log(data)
        for (var i = 0; i < data.length; ++i){
          let coordinates = data[i]["geolocation"]["coordinates"];
          let coords = [];
          for (var j = 0; j < coordinates.length/2; j++) {
            let lat = coordinates[2*j];
            let lon = coordinates[2*j+1];
            //let coord = {lat: lat, lon: lon}
            let coord = [lat, lon]
            coords.push(coord);
          };
          var settlementdatas = data[i];
          console.log(coords[0])
          var polygon = L.polygon(coords, {color: 'red', data: data[i]}).on({mouseover: polygonHover, click: polygonClick});
          //polygon.options = data;
          polygon.addTo(settlementslayer);
          var marker = new L.marker(coords[0]).on('click', function(e){
              map.setView(e.latlng, 13);
          });
          marker.addTo(settlementslayer);
          }
      });
      

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

          }
      }

  var origins = ["Topography", "Within Cities", "Weather", "Security"];
  var architectures = ["House Quality", "Materials", "Development State", "Access to Energy", "Access to Water", "Access to Sanitation", "Access to Internet or Phone Fare", "Mobility Systems", "Elevation"];
  var populaces = ["Health Care", "Number of Hospitals, Clinics, or Health Cares", "Education", "Number of Schools", "Proximity to Public Areas or Leisure Activities", "Unemployment Rate", "Ownernship", "Ethic and Racial Categories"];
  function updateDataInSidebar(data) {
    let sidebarinst = document.getElementById("sidebar");
    console.log(sidebarinst)
    /*var wcauses = "Causes";
    var wpop = "Population"*/
    

    function getFormValue(tree) {
      // Given the location of a field in a schema (i.e. ["site", "origin", "causes"]), return its value or null if it doesnt exist
      //console.log(tree)
      let val = data;
      tree.forEach(function (t) {

        if (val != null) {
          if (t in val) {
            val = val[t]
          }
          else {
            val = null;
          }
        }
        else {
          val = null;
        }
      });
      console.log(val)
    
      if (typeof val === 'object') {
        console.log('array')
        if (val !== null) {
          if (val === [''] || val === []) {
            return null;
          } else {
            console.log('this is the array', val)
            try {
              let lst = val.join(', ')
              return lst
            } catch (error) {
              return val
            }
          }
        } else {
          return val;
        }
      } else if (typeof val === 'string') {
        if (val === "") {
          return "N/A";
        } else {
          return val;
        }
      } else {
        return val;
      }
    }
    let siteOriginCauses = getFormValue(["site","origin","causes"]) == null ? "N/A": getFormValue(["site","origin","causes"]);
    let siteOriginPop = getFormValue(["site","origin","population"]) == null ? "N/A": getFormValue(["site","origin","population"]);
    let siteGeoTop = getFormValue(["site","geography","topography"]) == null ? "N/A": getFormValue(["site","geography","topography"]);
    let siteGeoWith = getFormValue(["site","geography","withinCities"]) == null ? "N/A": getFormValue(["site","geography","withinCities"]);
    let siteVulRes = getFormValue(["site","vulnerability","resilienceToNaturalCauses"]) == null ? "N/A": getFormValue(["site","vulnerability","resilienceToNaturalConditions"]);
    let siteVulCri = getFormValue(["site","vulnerability","crimeRate"]) == null ? "N/A": getFormValue(["site","vulnerability","crimeRate"]);
    let siteVulPer = getFormValue(["site","vulnerability","perceptionOfInsecurity"]) == null ? "N/A": getFormValue(["site","vulnerability","perceptionOfInsecurity"]);
    let siteVulCom = getFormValue(["site","vulnerability","communityEngagement"]) == null ? "N/A": getFormValue(["site","vulnerability","communityEngagement"]);
    let arcPhyHou = getFormValue(["architecture","physicalNature","houseQuality"]) == null ? "N/A": getFormValue(["architecture","physicalNature","houseQuality"]);
    let arcPhyMat = getFormValue(["architecture","physicalNature","materials"]) == null ? "N/A": getFormValue(["architecture","physicalNature","materials"]);
    let arcPhyDev = getFormValue(["architecture","physicalNature","developmentState"]) == null ? "N/A": getFormValue(["architecture","physicalNature","developmentState"]);
    let arcInfAEl = getFormValue(["architecture","infrastructure","accessToEnergy"]) == null ? "N/A": getFormValue(["architecture","infrastructure","accessToEnergy"]);
    let arcInfSEl = getFormValue(["architecture","infrastructure","sourceOfEnergy"]) == null ? "N/A": getFormValue(["architecture","infrastructure","sourceOfEnergy"]);
    let arcInfWat = getFormValue(["architecture","infrastructure","accessToWater"]) == null ? "N/A": getFormValue(["architecture","infrastructure","accessToWater"]);
    let arcInfSan = getFormValue(["architecture","infrastructure","accessToSanitation"]) == null ? "N/A": getFormValue(["architecture","infrastructure","accessToSanitation"]);
    let arcInfStr = getFormValue(["architecture","infrastructure","physicalStateOfStreets"]) == null ? "N/A": getFormValue(["architecture","infrastructure","physicalStateOfStreets"]);
    let arcInfPho = getFormValue(["architecture","infrastructure","accessToInternetOrPhoneFare"]) == null ? "N/A": getFormValue(["architecture","infrastructure","accessToInternetOrPhoneFare"])
    let arcInfMob = getFormValue(["architecture","infrastructure","mobilitySystems"]) == null ? "N/A": getFormValue(["architecture","infrastructure","mobilitySystems"]);
    let popDenEle = getFormValue(["populace","density","elevation"]) == null ? "N/A": getFormValue(["populace","density","elevation"]);
    let popDenHou = getFormValue(["populace","density","householdPerHouseSize"]) == null ? "N/A": getFormValue(["populace","density","householdPerHouseSize"]) ;
    let popQuaPro = getFormValue(["populace","qualityOfLife","proximity"]) == null ? "N/A": getFormValue(["populace","qualityOfLife","proximity"]);
    let popQuaHea = getFormValue(["populace","qualityOfLife","accessToHealthCare"]) == null ? "N/A": getFormValue(["populace","qualityOfLife","accessToHealthCare"]);
    let popQuaFac = getFormValue(["populace","qualityOfLife","numberOfHealthCareFacilities"]) == null ? "N/A": getFormValue(["populace","qualityOfLife","numberOfHealthCareFacilities"]);
    let popQuaEdu = getFormValue(["populace","qualityOfLife","accessToEducation"]) == null ? "N/A": getFormValue(["populace","qualityOfLife","accessToEducation"]);
    let popQuaUne = getFormValue(["populace","qualityOfLife","unemploymentRate"]) == null ? "N/A": getFormValue(["populace","qualityOfLife","unemploymentRate"])
    let popQuaInf = getFormValue(["populace","qualityOfLife","employmentInTheInformalSector"]) == null ? "N/A": getFormValue(["populace","qualityOfLife","employmentInTheInformalSector"]);
    let popQuaOwn = getFormValue(["populace","qualityOfLife","ownershipRights"]) == null ? "N/A": getFormValue(["populace","qualityOfLife","ownershipRights"]);
    let popQuaAge = getFormValue(["populace","qualityOfLife","ageGroups"]) == null ? "N/A": getFormValue(["populace","qualityOfLife","ageGroups"]);
    let popQuaEth = getFormValue(["populace","qualityOfLife","ethinicIdentities"]) == null ? "N/A": getFormValue(["populace","qualityOfLife","ethinicIdentities"]);
    let popQuaGen = getFormValue(["populace","qualityOfLife","gender"]) == null ? "N/A": getFormValue(["populace","qualityOfLife","gender"]);
    let infInd = getFormValue(["indicator", "informalityIndicator"])
    let siteInd = getFormValue(["indicator", "siteIndicator"])
    let archInd = getFormValue(["indicator", "architecturIndicator"])
    let popInd = getFormValue(['indicator', "populationIndicator"])

    sidebarinst.innerHTML=
      "<span class = \"name\"> Name:" + data['name'] + "</span>" + "<br>" 
      + "<span class = \"labels\">Informality: </span>" + infInd + "<br>" 
      + "<span class = \"labels\">SITE</span>" + "<br>" 
      + "<span class = \"labels\">origin</span>" + "<br>" 
      + "<span class = \"causes\"> Causes: </span>" + siteOriginCauses + "<br>" 
      + "<span class = \"population\"> Population: </span>" + siteOriginPop + "<br>" 
      + "<span class = \"labels\">geography</span>" + "<br>" 
      + "<span class = \"topography\"> Topography: </span>" + siteGeoTop + "<br>" 
      + "<span class = \"withinCities\"> Within Cities: </span>" + siteGeoWith + "<br>" 
      + "<span class = \"labels\">vulnerability</span>" + "<br>" 
      + "<span class = \"resilienceToNaturalConditions\">Resilience To Natural Conditions: </span>" + siteVulRes + "<br>" 
      + "<span class = \"crimeRate\"> Crime Rate: </span>" + siteVulCri + "<br>" 
      + "<span class = \"perceptionOfInsecurity\"> Perception of Insecurity: </span>" + siteVulPer + "<br>" 
      + "<span class = \"communityEngagement\"> Community Engagement: </span>" + siteVulCom + "<br>" 
      + "<span class = \"labels\">ARCHITECTURE</span>" + "<br>" 
      + "<span class = \"labels\">physicalNature</span>" + "<br>" 
      + "<span class = \"houseQuality\"> House Quality: </span>" + arcPhyHou + "<br>" 
      + "<span class = \"materials\"> Materials: </span>" + arcPhyMat + "<br>" 
      + "<span class = \"developmentState\"> Development State: </span>" + arcPhyDev + "<br>" 
      + "<span class = \"labels\">infrastructure</span>" + "<br>" 
      + "<span class = \"accessToEnergy\"> Access to Energy: </span>" + arcInfAEl + "<br>" 
      + "<span class = \"sourceOfEnergy\"> Source of Energy: </span>" + arcInfSEl + "<br>" 
      + "<span class = \"accessToWater\"> Access to Water: </span>" + arcInfWat + "<br>" 
      + "<span class = \"accessToSanitation\"> Access to Sanitation: </span>" + arcInfSan + "<br>" 
      + "<span class = \"physicalStateOfStreets\"> Physical State of Streets: </span>" + arcInfStr + "<br>" 
      + "<span class = \"accessToInternetOrPhoneFare\"> Access to Internet or Phone Fare: </span>" + arcInfPho + "<br>" 
      + "<span class = \"mobilitySystems\"> Mobility Systems: </span>" + arcInfMob + "<br>" 
      + "<span class = \"labels\">density</span>" + "<br>" 
      + "<span class = \"elevation\"> Elevation: </span>" + popDenEle + "<br>" 
      + "<span class = \"householdPerHouseSize\"> Household per House Size: </span>" + popDenHou + "<br>" 
      + "<span class = \"labels\">POPULACE</span>" + "<br>" 
      + "<span class = \"labels\">qualityOfLife</span>" + "<br>" 
      + "<span class = \"proximity\"> Proximity: </span>" + popQuaPro + "<br>" 
      + "<span class = \"accessToHealthCare\"> Access To Health Care: </span>" + popQuaHea + "<br>"
      + "<span class = \"numberOfHealthCareFacilities\"> Number of Health Care Facilities: </span>" + popQuaFac + "<br>" 
      + "<span class = \"accessToEducation\"> Access To Education: </span>" + popQuaEdu + "<br>" 
      + "<span class = \"unemploymentRate\"> Unemployment Rate: </span>" + popQuaUne + "<br>" 
      + "<span class = \"employmentInTheInformalSector\"> Employment In the Informal Sector: </span>" + popQuaInf + "<br>" 
      + "<span class = \"ownershipRights\"> Ownership Rights: </span>" + popQuaOwn + "<br>" 
      + "<span class = \"ageGroups\"> Age Groups: </span>" + popQuaAge + "<br>" 
      + "<span class = \"ethinicIdentities\"> Ethnic Identities: </span>" +  popQuaEth + "<br>" 
      + "<span class = \"gender\"> Gender Roles: </span>" + popQuaGen + "<br>" 
      + "<canvas id=\"can\" width=\"100\" height=\"100\"/>"
  
      
  }

  function createspans(array){
    var finalspan = "";
    for (var i = 0; i < array.length; i++){
      finalspan += "<span class = \"tags\">" + array[i].bold() + ": unknown" + "</span>" 
    }
    return finalspan; 
  }

  try{
    var canvas = document.getElementById("can");
    var ctx = canvas.getContext("2d");
    var lastend = 0;
    var data = [200,60,15];
    var myTotal = 0;
    var myColor = ['red','green','blue'];

    for(var e = 0; e < data.length; e++)
    {
      myTotal += data[e];
    }

    for (var i = 0; i < data.length; i++) {
    ctx.fillStyle = myColor[i];
    ctx.beginPath();
    ctx.moveTo(canvas.width/2,canvas.height/2);
    ctx.arc(canvas.width/2,canvas.height/2,canvas.height/2,lastend,lastend+(Math.PI*2*(data[i]/myTotal)),false);
    ctx.lineTo(canvas.width/2,canvas.height/2);
    ctx.fill();
    lastend += Math.PI*2*(data[i]/myTotal);
    }
  } catch (error) {
    console.log(error)
  }

  //check for attributes

  /*settlements.then(response => response.json())
      .then(data => {
        console.log(data)
        for (var i = 0; i < data.length; ++i){
          let coordinates = data[i]["geolocation"]["coordinates"];
          let coords = [];
          for (var j = 0; j < coordinates.length/2; j++) {
            let lat = coordinates[2*j];
            let lon = coordinates[2*j+1];
            //let coord = {lat: lat, lon: lon}
            let coord = [lat, lon]
            coords.push(coord);
          };
          var polygon = L.polygon(coords, {color: 'red'}).on("click", circleClick);
          polygon.addTo(settlementslayer);
          }
      });*/
  function circleClick(e){
    var clickedCircle = e.target.options;
    console.log(e.target.options);
    var name = clickedCircle.name;
    var country = clickedCircle.country;
    var continent = clickedCircle.continent;
    var finalcauses = clickedCircle.finalcauses;
    var finalpop = clickedCircle.finalpop;
    sidebar.show();
    updateDataInSidebar(name, country, continent, finalcauses, finalpop);
  }
  function polygonClick(e) {
    console.log(e.target)
    let data = e.target.options.data
    //console.log(data)
    sidebar.show();
    updateDataInSidebar(data);
  }

  var settlename = L.control();

  ///Show textbox for name of settlement
      settlename.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'settlename');
        //this.update();
        return this._div;
      };
  settlename.update = function (data) {
    this._div.innerHTML = '<h4 style="padding: 10px; background-color: white; opacity: .8; border-radius: 5px;">Selected Settlement: ' + data["name"]+"</h4>";
  }
  //settlename.addTo(map); 

function polygonHover(e) {
  let data = e.target.options.data
  settlename.update(data);
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
///Show textbox for population living in slums and such
    info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info');
      this.update();
      return this._div;
    };

    info.update = function (value, pop) {
      if (pop == 0){
        this._div.innerHTML = '<h4>Population living in informal settlements (% of urban population)</h4>' + value + ': no specific population at this slum';
      }
      else if (pop == -1){
        this._div.innerHTML = '<h4>Population living in informal settlements (% of urban population)</h4>' + value + ': no data';
      }
      else{
        this._div.innerHTML = '<h4>Population living in informal settlements (% of urban population)</h4>' + value + ": " 
        + pop;
        }
    };


  info.addTo(map); 

  //colour depending on population
  function getColor(d) {
    return d > 15000000 ? '#825e69' :
          d > 10000000  ? '#bb959d' :
          d > 5000000  ? '#d6999a' :
          d > 1000000  ? '#d6a899' :
          d > 500000  ? '#d6b899' :
          d > 100000   ? '#d6c799' :
          d >= 0  ? '	#d6d699' :
                      '#202020';
  }

  function getColorex(d){
    return d > 90 ? ' #825e69' :
          d > 75  ? '#bb959d' :
          d > 60  ? '#d6999a' :
          d > 45  ? '#d6a899' :
          d > 30 ? '#d6b899' :
          d > 15   ? '#d6c799' :
          d >= 0  ? '#	#d6d699' :
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
          ('no data'+ '<br>'));
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
  ///Country click
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

  //country outline into geojson ==> the map click
 $.ajax({}).done(function(data){

    countries.then(response => response.json())
      .then(data => {
        console.log(data)
        geojson= L.geoJson(data, {
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
    })

    //settlement outline into geojson THIS IS GIVING ME ISSUES**
  /*$.ajax({}).done(function(data){

    settlements.then(response => response.json())
      .then(data => {
        //console.log(data)
        allPointsLG2 = L.geoJSON(data, {
          onEachFeature: function (feature, layer) {
            layer.bindPopup('<h1>'+feature.properties.name+'</h1>');
          }
        }).addTo(map);

          //overlaysObj["settlements"] = allPointsLG2;
          //overlaysObj["settlements"] = settlements;
        });
    })*/

  }


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

  //this is where we add the settlement data
  function changeoflayers(layout){
    if (layout === "settlement"){
      //altermarkers();
      settlename.addTo(map); 
      info.remove();
      addtoMap();
      //add the data (only 709 is tester)
      map.addLayer(dark);
      //legend.remove(map);
      map.removeLayer(dark2);
      legendapp.remove(map);
      sliderControl.remove();
      map.setView([0,0], 3);
      map.removeLayer(pinslayer);
      map.addLayer(settlementslayer); //displays every point
      //adding the settlement layer
      if (map.hasLayer(overlaysObj["countries"])){
        map.removeLayer(overlaysObj["countries"]);
        }
      }
      if (layout === "country"){
        sidebar.hide();
        info.addTo(map); 
        settlename.remove();
        removefromMap();
        //legend.addTo(map);
        legendapp.remove(map);
        map.addLayer(dark);  
        map.setView([0,0], 3);
        sliderControl.remove();
        map.removeLayer(dark2);
        map.removeLayer(pinslayer);
        map.removeLayer(settlementslayer); //displays every point
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
        settlename.remove();
        map.removeLayer(settlementslayer); 
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

