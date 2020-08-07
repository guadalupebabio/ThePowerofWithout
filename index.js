require('dotenv').config();

let express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require('connect-flash'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    snapPointsToGrid = require('./app/util/snapPointsToGrid.js');

let app = express(),
    router = express.Router();

const PORT = process.env.PORT || 3000,
      DB_URL = `mongodb+srv://${process.env.MONGODB_USERNAME}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@cluster0-d6pne.mongodb.net/the_power_of_without?retryWrites=true&w=majority`,
      APP_DB_URL = `mongodb+srv://${process.env.APP_MONGODB_USERNAME}:${process.env.APP_MONGODB_PASSWORD}@cluster1.oxiff.mongodb.net/test?retryWrites=true&w=majority`;

// ** SETUP **
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', './views');
app.set('view engine', 'pug');
app.use(cookieParser());
app.use(session({secret: "cookie key", cookie: { maxAge: 60000 }}));
app.use(flash());

// ** CONNECT TO DB **
const main_conn = mongoose.createConnection(DB_URL),
      app_conn = mongoose.createConnection(APP_DB_URL),
      Settlement = require("./app/db/models/Settlement")(main_conn),
      User = require("./app/db/models/User")(main_conn),
      Pin = require("./app/db/models/Pin")(app_conn);

// ** ROUTES **
app.get("/", function(req, res){
  res.render("index");
});

app.get("/contribute", function(req, res){ // Create the initial settlement
  let sections = [[
    {
      label: "Name of the Informal Settlement",
      name: "settlement",
      type: "text"
    },
    {
      label: "Coordinates",
      name: "geolocation",
      type: "coords",
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
      label: "Email Address",
      name: "email",
      type: "text",
    },
  ]];
  res.render("form", {sections: sections, url: "/api/settlements", notification: 'Already created a settlement? Edit it <a href = "/contribute/u">here</a>', map: true, error: req.flash("form-error")});
});

app.get("/contribute/u/", function(req, res){ // Find settlement that you've already created
  let sections = [[
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
      label: "Email Address",
      name: "email",
      type: "text",
    },
  ]];
  res.render("form", {sections: sections, url: "/api/get-settlement", notification: req.flash("form-notification"), error: req.flash("form-error")});
})

app.get("/contribute/u/:contribution/:secret", function(req, res){ // Update the settlement
  User.findOne({secret: req.params.secret, contribution: req.params.contribution}, function(err, user){
    Settlement.findOne({_id: user.contribution}, function(err, settlement){

      function getFormValue(tree){ // Given the location of a field in a schema (i.e. ["site", "origin", "causes"]), return its value or null if it doesnt exist
        let val = settlement;
        tree.forEach(function(t){
          if(t in val) val = val[t];
          else return null;
        });
        return val;
      }

      let sections = [
        // Site
        [
          {
            label: "Origin",
            name: "siteOriginCauses",
            type: "radio",
            options: ["Squatting", "Refugee Camp", "Illegal Subdivision", "Other"],
            value: getFormValue(["site", "origin", "causes"]),
            info: "Historical evolution of the settlement"
          },
          {
            label: "Continent",
            name: "siteOriginGeolocation",
            type: "radio",
            value: getFormValue(["site", "origin", "geolocation"]),
            options: ['Africa', 'Europe', 'North America', 'South America', 'Asia', 'Oceania', 'Antarctica']
          },
          {
            label: "Population",
            name: "siteOriginPopulation",
            value: getFormValue(["site", "origin", "population"]),
            type: "text",
          },
          {
            label: "Topography",
            name: "siteGeographyTopography",
            type: "radio",
            value: getFormValue(["site", "geography", "topography"]),
            options: ["By the coast", "Desert", "Valley", "Mountain", "Forest", "Water"],
            info: "Geographical features of the location of the Settlement "
          },
          {
            label: "Within cities",
            name: "siteGeographyWithinCities",
            type: "radio",
            value: getFormValue(["site", "geography", "withinCities"]),
            options: ["Squatting on the fringe", "In the path of development", "In the heart of the city", "Along railway tracks", "Residential centers", "Suburban industrial areas", "Old city slum"],
            info: "Relationship between the settlement geolocation and the city of reference"
          },
          {
            label: "Climate",
            name: "siteGeographyClimate",
            type: "radio",
            value: getFormValue(["site", "geography", "climate"]),
            options: ["Tropical (Type A)", "Arid (Type B)", "Temperate (Type C)", "Continental (Type D)", "Polar (Type E)"]
          },
          {
            label: "Security",
            name: "siteVulnerabilitySecurityCrimeRate",
            type: "range",
            value: getFormValue(["site", "vulnerability", "security", "crimeRate"]),
            options: ["Low crime rate", "Moderate crime rate", "High crime rate"],
            info: "Level of crime and insecurity in the Settlement"
          },
        ],

        // Architecture
        [
          {
            label: "House quality",
            name: "architecturePhysicalNatureHouseQuality",
            type: "radio",
            value: getFormValue(["architecture", "physicalNature", "houseQuality"]),
            options: ["Inadequate", "Suitable", "Optimal"]
          },
          {
            label: "Materials from which the house in the Settlement is made with",
            name: "architecturePhysicalNatureMaterials",
            type: "checkbox",
            value: getFormValue(["architecture", "physicalNature", "materials"]),
            options: ["Mud", "Brick", "Wood", "Concrete", "Corrugated sheet", "Tarpaulin", "Tiles", "Other"],
          },
          {
            label: "Development State",
            name: "architecturePhysicalNatureDevelopmentState",
            type: "radio",
            value: getFormValue(["architecture", "physicalNature", "developmentState"]),
            options: ["Initial occupancy", "Transitional", "Establish"],
            info: "Stage of the evolution process where the Settlement is into"
          },
          {
            label: "Access to Energy",
            name: "architectureInfrastructureAccessEnergy",
            type: "radio",
            value: getFormValue(["architecture", "infrastructure", "accessToEnergy"]),
            options: ["0-10%", "10-25%", "25-50%", ">50%"],
            info: "Percentage of dwellings that have access to power/electricity in the Settlement"
          },
          {
            label: "Access to Water",
            name: "architectureInfrastructureAccessWater",
            type: "radio",
            value: getFormValue(["architecture", "infrastructure", "accessToWater"]),
            options: ["0-10%", "10-25%", "25-50%", ">50%"],
            info: "Percentage of dwellings that have access to drinking water in the Settlement"
          },
          {
            label: "Access to Sanitation",
            name: "architectureInfrastructureAccessSanitation",
            type: "radio",
            value: getFormValue(["architecture", "infrastructure", "accessToSanitation"]),
            options: ["0-10%", "10-25%", "25-50%", ">50%"],
            info: "Percentage of dwellings that have access to sanitation in the Settlement"
          },
          {
            label: "Access to Internet or Phone Fare",
            name: "architectureInfrastructureAccessInternet",
            type: "radio",
            value: getFormValue(["architecture", "infrastructure", "accessToInternetOrPhoneFare"]),
            options: ["0-10%", "10-25%", "25-50%", ">50%"],
            info: "Percentage of people that has access to data-plans or phone fare"
          },
          {
            label: "Mobility systems",
            name: "architectureMobility",
            type: "checkbox",
            value: getFormValue(["architecture", "infrastructure", "mobilitySystems"]),
            options: ["Walk", "Bike", "Car", "Public transportation"],
            info: "Mobility systems used by the people in the Settlement"
          },
          {
            label: "Average number of floors in the buildings",
            name: "architectureDensityElevation",
            type: "radio",
            value: getFormValue(["architecture", "density", "averageFloors"]),
            options: ["1", "2", "3", ">3"]
          },
          {
            label: " Number of people living in a house",
            name: "architectureDensityHouseholdPerHouseSize",
            value: getFormValue(["architecture", "density", "householdPerHouseSize"]),
            type: "text"
          },
        ],

        // Population
        [
          {
            label: "Health Care: Percentage of people that has access to health care",
            name: "populaceHealthCare",
            type: "radio",
            options: ["0-10%", "10-25%", "25-50%", ">50%"],
            value: getFormValue(["populace", "accessToHealthCare"]),
          },
          {
            label: "Number of hospitals, clinics or health cares in the Settlement",
            name: "populaceHospitals",
            type: "text",
            value: getFormValue(["populace", "numberHospitals"]),
          },
          {
            label: "Education: Percentage of people that has access to schools/ Percentage of people attending to schools",
            name: "populaceEducation",
            type: "radio",
            options: ["0-10%", "10-25%", "25-50%", ">50%"],
            value: getFormValue(["populace", "accessToEducation"]),
          },
          {
            label: "Number of schools in the settlement",
            name: "populaceSchools",
            type: "text",
            value: getFormValue(["populace", "numberSchools"]),
          },
          {
            label: "Proximity to public areas or leisure activities",
            name: "populacePublicAreas",
            type: "radio",
            options: ["5 min walking distance", "5-20 min walking distance", ">20 min walking distance", "I need to take a car/public transportation"],
            value: getFormValue(["populace", "publicAreas"]),
          },
          {
            label: "Unemployment rate",
            name: "populaceUnemploymentRate",
            type: "text",
            value: getFormValue(["populace", "unemploymentRate"]),
          },
          {
            label: "Ownership: Level of rights that the householder has on possessing the land at the Settlement",
            name: "populaceOwnership",
            type: "radio",
            options: ["Community/city property", "Private house", "Illegal"],
            value: getFormValue(["populace", "ownershipRights"]),
          },
          // {
          //   label: "Ethnic and racial categories in the Settlement",
          //   name: "populaceEthnic",
          //   type: "text",
          // },
          // {
          //   label: "Demography: Percentage of people in each age groups in the Settlement",
          //   name: "populaceDemography",
          //   type: "text",
          // },
        ]
      ];

      res.render("form", {settlement: settlement, sections: sections, notification: req.flash('form-notification'), url: "/api/settlements/u/" + user.contribution + "/" + req.params.secret, error: req.flash("form-error")});
    });
  })
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

app.get("/pins", function(req, res){
  Pin.find({}, function(err, docs){
    if(err) throw err;
    res.render("pins", {"pins": docs.map(function(d, i){
      d.pin.coordinates = [d.pin.coordinates[1], d.pin.coordinates[0]];
      return d;
    })});
  });
});

app.get("/pins/snap", function(req, res){
  Pin.find({}, function(err, docs){
    if(err) throw err;
    res.render("pins", {"pins": docs.map(function(d, i){
      if(i == 0) console.log(d.pin.coordinates);
      d.pin.coordinates = snapPointsToGrid(d.pin.coordinates[1], d.pin.coordinates[0]);
      if(i == 0) console.log(d.pin.coordinates);
      return d;
    })});
  });
});

app.use("/api", require("./app/routes/api.js")(User, Settlement, Pin));

// ** START THE SERVER **

app.listen(PORT);
console.log("Running on http://127.0.0.1:" + PORT);
module.exports = app;
