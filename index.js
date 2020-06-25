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
    [],

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
