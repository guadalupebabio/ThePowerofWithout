let express = require("express"),
    mongoose = require("mongoose"),
    Settlement = require("../db/models/Settlement"),
    User = require("../db/models/User"),
    crypto = require('crypto'),
    geo = require("../util/geo.js");

let router = express.Router();

// Middleware which throws an error if any of the form fields are empty
function preventEmptyFormFields(req, res, next){
  for(let field in req.body){
    if(req.body.hasOwnProperty(field) && !req.body[field].length) {
      req.flash('form-error', "Please fill out all fields");
      req.error = true;
      break;
    }
  }
  next();
}

//TODO; middleware to clean and strip form strigns

// Returns a JSON array containing settlement data
router.get("/settlements", function(req, res){
  Settlement.find({}, function(err, docs){
    if(err) throw err;
    res.json(docs);
  });
});

// Given Lat and Lon, return what country the point is.
router.get("/get-country", function(req, res){
  let lat = parseFloat(req.query.lat),
      lon = parseFloat(req.query.lon);
  res.send(geo.getCountry(lat, lon));
});

// Given name and email, redirect to the correct settlement.
router.post("/get-settlement", preventEmptyFormFields, function(req, res){
  if(req.error) res.redirect("/contribute/u/");
  else Settlement.findOne({
    "name": `${req.body.settlement}, ${req.body.city}`
  }, function(err, settlement){
    if(!err && settlement) User.findOne({
      "contribution": settlement._id,
      "email": req.body.email
    }, function(err, user){
      if(!err && user){
        res.redirect("/contribute/u/" + settlement._id + "/" + user.secret);
      }
      else{
        req.flash('form-notification', "No settlement found");
        res.redirect("/contribute/u/");
      }
    })
    else {
      req.flash('form-notification', "No settlement found");
      res.redirect("/contribute/u/");
    }
  });
});

// Add new settlement to database
router.post("/settlements", preventEmptyFormFields, function(req, res){
  if(req.error) {
    res.redirect("/contribute");
    return
  }

  let coords = req.body.geolocation.split(",").map((d) => parseFloat(d));

  if(coords.length != 2 || isNaN(coords[0]) || isNaN(coords[1])){
    req.flash("form-error", "Invalid Coordinates");
    res.redirect("/contribute");
    return;
  }

  crypto.randomBytes(12, function(err, buffer) {
    let token = buffer.toString('hex');

    let settlement = new Settlement({
      "name": `${req.body.settlement}, ${req.body.city}`,
      "country": req.body.country,
      "geolocation": {type: 'Point', coordinates: coords},
      "email": req.body.email,
    });

    let user = new User({
      "email": req.body.email,
      "contribution": settlement._id,
      "secret": token
    })

    settlement.save(function(){
      user.save(function(){
        req.flash('form-notification', "Thanks for contributing a settlement! You can work on adding more information now, or complete it at a later date—we've sent a link to your email!");
        res.redirect("/contribute/u/" + settlement._id + "/" + token);
      })
    });
  });
});

// Update existing settlement
router.post("/settlements/u/:id/:secret", function(req, res){
  User.findOne({secret: req.params.secret, contribution: req.params.contribution}, function(err, user){
    Settlement.findOneAndUpdate(
      {
        _id: req.params.id
      },
      {
      "site": {
        "origin": {
          "causes": req.body.siteOriginCauses,
          "geolocation": req.body.siteOriginGeolocation, // Continent
          "population": req.body.siteOriginPopulation != null && !isNaN(parseInt(req.body.siteOriginPopulation)) ? parseInt(req.body.siteOriginPopulation) : null,
        },
        "geography": {
          "topography": req.body.siteGeographyTopography,
          "withinCities": req.body.siteGeographyWithinCities,
          "climate": req.body.siteGeographyClimate,
        },
        "vulnerability": {
          "security": {
            "crimeRate": req.body.siteVulnerabilitySecurityCrimeRate,
          },
        }
      },
      "architecture": {
        "physicalNature": {
          "houseQuality": req.body.architecturePhysicalNatureHouseQuality,
          "materials": req.body.architecturePhysicalNatureMaterials,
          "developmentState": req.body.architecturePhysicalNatureDevelopmentState
        },
        "infrastructure": {
          "accessToEnergy": req.body.architectureInfrastructureAccessEnergy,
          "accessToWater": req.body.architectureInfrastructureAccessWater,
          "accessToSanitation": req.body.architectureInfrastructureAccessSanitation,
          "accessToInternetOrPhoneFare": req.body.architectureInfrastructureAccessInternet,
          "mobilitySystems": req.body.architectureMobility,
        },
        "density": {
          "averageFloors": req.body.architectureDensityElevation,
          "householdPerHouseSize": req.body.architectureDensityHouseholdPerHouseSize,
        }
      },
      "populace": {
        "accessToHealthCare": req.body.populaceHealthCare,
        "accessToEducation": req.body.populaceEducation,
        "publicAreas": req.body.populacePublicAreas,
        "ownershipRights": req.body.populaceOwnership,
        "numberHospitals": req.body.populaceHospitals,
        "numberSchools": req.body.populaceSchools,
        "unemploymentRate": req.body.populaceUnemploymentRate,
        "ethnicRacialCategories": req.body.ethnicRacialCategories,
        "demography": req.body.demography,
      }
    },
    function(err){
      req.flash('form-notification', "Successfully updated settlement data!");
      res.redirect("/contribute/u/" + req.params.id + "/" + req.params.secret);
    })
  })

});

module.exports = router;
