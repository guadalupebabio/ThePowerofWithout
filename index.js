require('dotenv').config();

let express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Settlement = require("./app/db/models/Settlement");

let app = express(),
    router = express.Router();

const PORT = process.env.PORT || 3000,
      DB_URL = `mongodb+srv://${process.env.MONGODB_USERNAME}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@cluster0-d6pne.mongodb.net/the_power_of_without?retryWrites=true&w=majority`;

// ** SETUP **

app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', './views');
app.set('view engine', 'pug');

// ** CONNECT TO DB **
mongoose.connect(DB_URL, function(err, res) {
  if(err) console.log("ERROR connecting to database");
  else console.log("SUCCESSfully connected to database");
});

// ** ROUTES **
app.get("/", function(req, res){
  res.render("index");
});

app.get("/contribute", function(req, res){
  let sections = [
    // General
    [
      {
        label: "Name of the Informal Settlement",
        name: "settlement",
        type: "text"
      },
      {
        label: "Name of the City",
        name: "city",
        type: "text"
      },
      {
        label: "Name of the Country",
        name: "country",
        type: "text"
      },
      {
        label: "Coordinates",
        name: "geolocation",
        type: "coords",
      },
      {
        label: "Email Address",
        name: "email",
        type: "text",
      },
    ],

    // Site
    [
      {
        label: "Origin: Historical evolution of the settlement",
        name: "siteOriginCauses",
        type: "radio",
        options: ["Squatting", "Refugee Camp", "Illegal Subdivision", "Other"]
      },
      {
        label: "Geolocation: In which Continent is the settlement located",
        name: "siteOriginGeolocation",
        type: "radio",
        options: ['Africa', 'Europe', 'North America', 'South America', 'Asia', 'Oceania', 'Antarctica']
      },
      {
        label: "Population: Aprox. number of people living in the Settlement",
        name: "siteOriginPopulation",
        type: "text",
      },
      {
        label: "Topography: Geographical features of the location of the Settlement ",
        name: "siteGeographyTopography",
        type: "radio",
        options: ["By the coast", "Desert", "Valley", "Mountain", "Forest", "Water"]
      },
      {
        label: "Within cities: Relationship between the settlement geolocation and the city of reference",
        name: "siteGeographyWithinCities",
        type: "radio",
        options: ["Squatting on the fringe", "In the path of development", "In the heart of the city", "Along railway tracks", "Residential centers", "Suburban industrial areas", "Old city slum"]
      },
      {
        label: "Climate",
        name: "siteGeographyClimate",
        type: "radio",
        options: ["Tropical (Type A)", "Arid (Type B)", "Temperate (Type C)", "Continental (Type D)", "Polar (Type E)"]
      },
      // TODO: add prevalence
      {
        label: "Security: Level of crime and insecurity in the Settlement",
        name: "siteVulnerabilitySecurityCrimeRate",
        type: "radio",
        options: ["Low crime rate", "Moderate crime rate", "High crime rate"]
      },
    ],

    // Architecture
    [
      {
        label: "House quality: Quality-monitoring of the livability, function and construction/deployment of the house at the Settlement",
        name: "architecturePhysicalNatureHouseQuality",
        type: "radio",
        options: ["Inadequate", "Suitable", "Optimal"]
      },
      {
        label: "Materials: Matter from which the house in the Settlement is made with",
        name: "architecturePhysicalNatureMaterials",
        type: "checkbox",
        options: ["Mud", "Brick", "Wood", "Concrete", "Corrugated sheet", "Tarpaulin", "Tiles", "Other"]
      },
      {
        label: "Development State: Stage of the evolution process where the Settlement is into",
        name: "architecturePhysicalNatureDevelopmentState",
        type: "radio",
        options: ["Initial occupancy", "Transitional", "Establish"]
      },
      {
        label: "Access to Energy: Percentage of dwellings that have access to power/electricity in the Settlement",
        name: "architectureInfrastructureAccessEnergy",
        type: "radio",
        options: ["0-10%", "10-25%", "25-50%", ">50%"]
      },
      {
        label: "Access to Water: Percentage of dwellings that have access to drinking water in the Settlement",
        name: "architectureInfrastructureAccessWater",
        type: "radio",
        options: ["0-10%", "10-25%", "25-50%", ">50%"]
      },
      {
        label: "Access to sanitation: Percentage of dwellings that have access to sanitation in the Settlement",
        name: "architectureInfrastructureAccessSanitation",
        type: "radio",
        options: ["0-10%", "10-25%", "25-50%", ">50%"]
      },
      {
        label: "Access to Internet or phone fare: Percentage of people that has access to data-plans or phone fare",
        name: "architectureInfrastructureAccessInternet",
        type: "radio",
        options: ["0-10%", "10-25%", "25-50%", ">50%"]
      },
      {
        label: "Mobility systems: mobility systems used by the people in the Settlement",
        name: "architectureMobility",
        type: "checkbox",
        options: ["Walk", "Bike", "Car", "Public transportation"]
      },
      {
        label: "Elevation: Average number of floors in the buildings",
        name: "architectureDensityElevation",
        type: "radio",
        options: ["1", "2", "3", ">3"]
      },
      {
        label: "House hold per house: Number of people living in a house",
        name: "architectureDensityHouseholdPerHouseSize",
        type: "text"
      },
    ],

    // Population
    []
  ]
  res.render("form", {sections: sections});
});

app.get("/toolkit", function(req, res){
  res.render("toolkit");
});

app.get("/about", function(req, res){
  res.render("about");
});

app.get("/map", function(req, res){
  Settlement.find({}, function(err, settlements){
    if(err) throw err;

    let countries = {}; // Aggregate settlements by country

    settlements.forEach(function(settlement){
      if (!(settlement.country in countries)) countries[settlement.country] = [];
      countries[settlement.country].push(settlement);
    });

    res.render("map", {"settlements": settlements, "countries": countries});
  });
});

app.use("/api", require("./app/routes/api.js"));

// ** START THE SERVER **

app.listen(PORT);
console.log("Running on http://127.0.0.1:" + PORT);
module.exports = app;
