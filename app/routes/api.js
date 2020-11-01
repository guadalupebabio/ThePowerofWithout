let express = require("express"),
    mongoose = require("mongoose"),
    crypto = require('crypto'),
    // geo = require("../util/geo.js"),
    cleanFormFields = require("../middleware/cleanFormFields.js"),
    preventEmptyFormFields = require("../middleware/preventEmptyFormFields.js"),
    validateEmail = require("../middleware/validateEmail.js"),
    sendEmail = require("../util/email.js"),
    checkPrivacyChecked = require("../middleware/checkPrivacyChecked.js");
    
const {information} = require("../../00infromationdefs.js");
const {finalSurveyData, previousSettlementModal,sectionDataContainer , modalData}= require("../../data.js");
const e = require("express");
// const Survey = require("../db/models/Survey.js");


module.exports = function(User, Settlement,Survey, Pin, Comment, Link){
  let router = express.Router();

  // Returns a JSON array containing settlement data
  router.get("/settlements", function(req, res){
    Settlement.find({}, function(err, docs){
      if(err) throw err;
      res.json(docs);
    });
  });

  // Given Lat and Lon, return what country the point is.
  // router.get("/get-country", function(req, res){
  //   let lat = parseFloat(req.query.lat),
  //       lon = parseFloat(req.query.lon);
  //   res.send(geo.getCountry(lat, lon));
  // });

  // Given name and email, redirect to the correct settlement.
  router.post("/get-settlement", preventEmptyFormFields, cleanFormFields, validateEmail, function(req, res){
    console.log('This is the data I am getting',req.body);
    // res.render("form")
    if(req.error) {
      res.get("/contribute/")
      console.log(req.error);
      ;}
    else Settlement.findOne({
      "name": `${req.body.settlement}, ${req.body.city}`
    }, function(err, settlement){
      if(!err && settlement) User.findOne({
        "contribution": settlement._id,
        "email": req.body.email
      }, function(err, user){
        if(!err && user){
          console.log("I've found it");
          res.redirect("/contribute/u/" + settlement._id + "/" + user.secret);
        }
        else{
          req.flash('form-notification', "No settlement found");
          res.redirect("/contribute");
        }
      })
      else {
        console.log("no settlement found");
        req.flash('form-notification', "No settlement found");
        res.redirect("/contribute");
      }
    });
  });

  // Add new settlement to database
  router.post("/settlements", preventEmptyFormFields, cleanFormFields, validateEmail,checkPrivacyChecked, function(req, res){

   
    // console.log(req.body);

    if(req.error) {
      // res.redirect("/contribute");
      req.flash("form-error", "Invalid Coordinates")
      return
    }

    let coords = req.body.geolocation.split(",").map((d) => parseFloat(d));

    
    // if(coords.length != 2 || isNaN(coords[0]) || isNaN(coords[1])){
    //   req.flash("form-error", "Invalid Coordinates");
    //   res.redirect("/contribute");
    //   return;
    // }

    console.log(req.body);

    crypto.randomBytes(12, function(err, buffer) {
      let token = buffer.toString('hex');

      let settlement = new Settlement({
        "name": `${req.body.settlement}, ${req.body.city}`,
        "area": parseFloat(req.body.area),
        "country": req.body.country,
        "geolocation": {type: 'polygon', coordinates: coords},
        "email": req.body.email,
      });

      let user = new User({
        "email": req.body.email,
        "contribution": settlement._id,
        "secret": token
      })

      settlement.save(function(){
        user.save(function(){
          sendEmail(req.body.email, settlement._id, token);
          req.flash('form-notification', "Thanks for contributing a settlement! You can work on adding more information now, or complete it at a later date—we've sent a link to your email!");
          // res.redirect("/contribute/u/" + settlement._id + "/" + token);
          // res.send("all is well");
          // res.redirect("/contribute")
          // console.log(fillInFormData);
          // console.log(modalData);
          res.render("form", {
            sectionData: sectionDataContainer,
            modalData : modalData,
            modalClass : "modal-container",
            redirectUrl : "/contribute/u/" + settlement._id + "/" + token,
            url: "/api/settlements",
            notification:
              'Already created a settlement? Edit it <a href = "/contribute/u">here</a>',
            map: true,
            error: req.flash("form-error"),
          });
          // res.status(200);

        })
      });
    });
  });



  // Update existing settlement
  // router.post("/settlements/u/:id/:secret", cleanFormFields, function(req, res){
    router.post("/settlements/u/:id/:secret",function(req, res){

      // console.log(req.body["Causes"]);
      // console.log(req.body)
      let siteOriginCauses = req.body["Causes"] ;
      let siteOriginPopulation = req.body["Population"]!= null && !isNaN(parseInt(req.body["Population"])) ? parseInt(req.body["Population"]) : null;
      let siteGeographyTopography =   req.body["Topography Feautures"] ;
      let siteGeographyWithin = req.body["Location within the city"] ;
      let siteVulnerabilityResilience = req.body["Resilience to natural conditions"];
      let siteVulnerabilityCrimeRate = req.body["Crime rate"];
      let siteVulnerabilityPerception = req.body["Perception of Insecurity"];
      let siteVulnerabilityPrevalance = req.body["Prevalence"];
      let architecturePhysicalNatureHouseQuality = req.body["House Quality"];
      let architecturePhysicalNatureMaterials  =  req.body["Materials"] ;
      let architecturePhysicalNatureDev = req.body["Development State"];
      let architectureInfrastructureEnergyAccess = req.body["Access to Energy"];
      let architectureInfrastructureEnergySource =   req.body["Source of Energy"] ;
      let architectureInfrastructureWaterAccess = req.body["Access to Water"] ;
      let architectureInfrastructureSanitationAccess = req.body["Access to Sanitation"] ;
      let architectureInfrastructureInternetAccess = req.body["Access to Internet"] ;
      let architectureInfrastructureStreetState = req.body["Physical State of the Streets"] ;
      let architectureMobilitySystems =   req.body["Mobility Systems"];
      let populaceLifeQualityHouseHold =req.body["Household per house"] ;
      let populaceLifeQualityHealthCare = req.body["populaceHealthCare"] ;
      let populaceLifeQualityEducation=  req.body['Access to Education'] ;
      let populaceLifeQualityInformalSector =req.body['Employment in the formal sector']; 
      let populaceLifeQualityUnemploymentRate = req.body['Unemployment Rate'];
      let populaceLifeQualityOwnership = req.body["Ownership"];
      let populaceLifeQualityageGroups =req.body['Age groups'];
      let populaceLifeQualityGender =req.body["Gender"];


      User.findOne({secret: req.params.secret, contribution: req.params.contribution}, function(err, user){
      Settlement.findOneAndUpdate(
        {
          _id: req.params.id
        },
        {
        "site": {
          "origin": {
            "causes": siteOriginCauses,
            "population":siteOriginPopulation
          },
          "geography": {
            "topography": siteGeographyTopography,
            "withinCities": siteGeographyWithin,
          },
          "vulnerability": {
              "resilienceToNaturalConditions": siteVulnerabilityResilience,
              "crimeRate": siteVulnerabilityCrimeRate,
              "perceptionOfInsecurity": siteVulnerabilityPerception,
              "prevalance":siteVulnerabilityPrevalance
          }
        },
        "architecture": {
          "physicalNature": {
            "houseQuality": architecturePhysicalNatureHouseQuality,
            "materials": architecturePhysicalNatureMaterials,
            "developmentState": architecturePhysicalNatureDev
          },
          "infrastructure": {
            "accessToEnergy": architectureInfrastructureEnergyAccess,
            "sourceOfEnergy": architectureInfrastructureEnergySource,
            "accessToWater": architectureInfrastructureWaterAccess ,
            "accessToSanitation": architectureInfrastructureSanitationAccess,
            "physicalStateOfStreets": architectureInfrastructureStreetState,
            "accessToInternetOrPhoneFare": architectureInfrastructureInternetAccess,
            "mobilitySystems":architectureMobilitySystems ,

          }
        },
        "populace": {

          qualityOfLife:{
            "householdPerHouseSize":populaceLifeQualityHouseHold ,
            "accessToHealthCare":populaceLifeQualityHealthCare,
            "accessToEducation": populaceLifeQualityEducation,
            "unemploymentRate": populaceLifeQualityUnemploymentRate,
            "employmentInTheInformalSector":populaceLifeQualityInformalSector,
            "ownershipRights": populaceLifeQualityOwnership,
            "ageGroups":populaceLifeQualityageGroups,
            "gender":populaceLifeQualityGender

          }
        }
      },
      function(err){
        if (err){ console.log(err);}
      
       else{
        console.log("successfully updated");
        // req.flash('form-notification', "Successfully updated settlement data!");
        res.render("form", {
          sectionData: finalSurveyData,
          modalData : { 
              description:"",
              icons:[]
          },     
          modalClass : "modal-container-hide",
          previousModalData: "",
          previousModalClass : "previous-modal-container-hide",
          redirectUrl : "/contribute/u/" + req.params.id + "/" +req.params.secret,
          url: "/api/final-survey",
          notification:
            'Already created a settlement? Edit it <a href = "/contribute/u">here</a>',
          map: true,
          error: req.flash("form-error"),
          email: "",
        });


       }
      })
    })



  });

  router.post("/final-survey",(req,res)=>{

    //  console.log(req.body);
     let finalSurvey = new Survey({
      settlementRelationship: req.body["settlementRelationship"],
      informalSettlementName:req.body["informalSettlementName"],
      informalSettlementDefinition:req.body["informalSettlementDefinition"],
      surveyFillInDuration:req.body["surveyFillInDuration"],
      surveyRelevance:req.body["surveyRelevance"],
      generalFeedBack:req.body["generalFeedBack"],
      originImportanceScale: isNaN(parseInt(req.body["originImportanceScale"])) ? 0: parseInt(req.body["originImportanceScale"]) ,
      geographyImportanceScale:isNaN(parseInt(req.body["geographyImportanceScale"])) ? 0 : parseInt(req.body["geographyImportanceScale"]),
      vulnerabilityImportanceScale: isNaN(parseInt(req.body["vulnerabilityImportanceScale"])) ? 0 : parseInt(req.body["vulnerabilityImportanceScale"]),
      physicalNatureImportanceScale: isNaN(parseInt(req.body["physicalNatureImportanceScale"])) ? 0 :parseInt(req.body["physicalNatureImportanceScale"]) ,
      infrastructureImportanceScale: isNaN(parseInt(req.body["infrastructureImportanceScale"])) ? 0 : parseInt(req.body["infrastructureImportanceScale"]),
      densityImportanceScale:isNaN(parseInt(req.body["densityImportanceScale"])) ? 0:parseInt(req.body["densityImportanceScale"]),
      qualityOfLifeImportanceScale: isNaN(parseInt(req.body["qualityOfLifeImportanceScale"])) ? 0 : parseInt(req.body["qualityOfLifeImportanceScale"]),
      economyImportanceScale:  isNaN(parseInt(req.body["economyImportanceScale"])) ? 0:parseInt(req.body["economyImportanceScale"]),
      demographyImportanceScale:isNaN(parseInt(req.body["demographyImportanceScale"])) ? 0 :parseInt(req.body["demographyImportanceScale"])

     })
     !isNaN(parseInt(req.body["Population"])) ? parseInt(req.body["Population"]) : null
     finalSurvey.save((err)=>{
       if(err){
        console.log(err);
       }
       else{
         console.log("successfully saved");
         res.redirect("/");
       }
     })
  });

  router.post("/settlements/u/:id/:secret/comment", function(req, res){
    User.findOne({secret: req.params.secret, contribution: req.params.contribution}, function(err, user){
      Comment.updateOne(
        { settlementId: req.params.id },
        { $set: {
          email: req.body.email,
          formFieldName: req.body.formFieldName,
          comment: req.body.comment
        } },
        { upsert: true },
        function(err, comment){
          res.send(200);
        }
      );
    })
  })

  router.post("/settlements/u/:id/:secret/link", function(req, res){
    User.findOne({secret: req.params.secret, contribution: req.params.contribution}, function(err, user){
      Link.updateOne(
        { settlementId: req.params.id },
        { $set: {
          email: req.body.email,
          formFieldName: req.body.formFieldName,
          link: req.body.link
        } },
        { upsert: true },
        function(err, link){
          res.send(200);
        }
      );
    })
  })

  return router;
};


