/*
  api.js
  Makes the connection with MongoDB
*/


let express = require("express"),
    mongoose = require("mongoose"),
    fs = require("fs"),
    crypto = require('crypto'),
    cleanFormFields = require("../middleware/cleanFormFields.js"),
    preventEmptyFormFields = require("../middleware/preventEmptyFormFields.js"),
    validateEmail = require("../middleware/validateEmail.js"),
    sendEmail = require("../util/email.js"),
    checkPrivacyChecked = require("../middleware/checkPrivacyChecked.js");
    indicator = require("../util/javascript_analysis.js").settlementAnalysis

const util = require('util')
// const csv = require('csv-parser');
const parse = require('csv-parse')

async function settAnalysis(data, coords) {
  return await indicator(data, coords)
}
    
// Imports the Google Cloud client library.
const {Storage} = require('@google-cloud/storage');
const bucketName  = "the-power-of-without.appspot.com";


// Instantiates a client. If you don't specify credentials when constructing
// the client, the client library will look for credentials in the
// environment.
const storage = new Storage();

const {information} = require("../../00infromationdefs.js");
const {finalSurveyData, previousSettlementModal,sectionDataContainer , modalData}= require("../../data.js");
const e = require("express");

module.exports = function(User, Settlement,Survey, Pin, Comment, Link,Image,Country,upload,Subscriber){

  let router = express.Router();

  // Returns a JSON array containing settlement data
  router.get("/settlements", function(req, res){
    Settlement.find({}, function(err, docs){
      if(err) throw err;
      res.json(docs);
    });
  });


  //Returns countries in JSON format from db
  router.get("/countries", function(req, res){
    Country.find({}, function(err, docs){
      if(err) throw err;
      res.json(docs);
    });
  });

  // Given name and email, redirect to the correct settlement.
  router.post("/get-settlement", preventEmptyFormFields, cleanFormFields, validateEmail, function(req, res){
    console.log('This is the data I am getting',req.body);
    // res.render("form")
    if(req.error) {
      res.get("/shareknowledge/")
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
          res.redirect("/shareknowledge/u/" + settlement._id + "/" + user.secret);
        }
        else{
          req.flash('form-notification', "No settlement found");
          res.redirect("/shareknowledge");
        }
      })
      else {
        console.log("no settlement found");
        req.flash('form-notification', "No settlement found");
        res.redirect("/shareknowledge");
      }
    });
  });

  // Add new settlement to database
  router.post("/settlements", preventEmptyFormFields, cleanFormFields, validateEmail, function(req, res){

   
    if(req.error) {
      res.redirect("/shareknowledge");
      req.flash("form-error", "Invalid Coordinates")
      return
    }

    let coords = req.body.geolocation.split(",").map((d) => parseFloat(d));

  

    console.log(req.body);
    if ("privacy-checkbox" in req.body){

      let sub = new Subscriber({email:req.body.email,subscribed:true});
      sub.save((err)=>{if (err) {console.log(err)}else{console.log("saved")}});

    }

    crypto.randomBytes(12, function(err, buffer) {
      let token = buffer.toString('hex');

      let settlement = new Settlement({
        "name": `${req.body.settlement}, ${req.body.city}`,
        "area": parseFloat(req.body.area),
        "country": req.body.country,
        "geolocation": {type: 'polygon', coordinates: coords},
        "email": req.body.email,
        "area": req.body.area,
      });

      let user = new User({
        "email": req.body.email,
        "area": req.body.area,
        "contribution": settlement._id,
        "secret": token
      })



      console.log(user)

      settlement.save(function(){
        user.save(function(){
          sendEmail(req.body.email, settlement._id, token);
          req.flash('form-notification', "Thanks for contributing a settlement! You can work on adding more information now, or complete it at a later date—we've sent a link to your email!");
          res.redirect("/shareknowledge/u/" + settlement._id + "/" + token);
          

        })
      });
    });
  });



  // Update existing settlement
    router.post("/settlements/u/:id/:secret",function(req, res){
      

      let siteOriginCauses = req.body["Original causes"] ;
      let siteOriginPopulation = req.body["Population"]!= null && !isNaN(parseInt(req.body["Population"])) ? parseInt(req.body["Population"]) : null;
      let siteGeographyTopography =   req.body["Topography Feautures"];
      let siteGeographyWithin = req.body["Location within the city"] ;
      let siteVulnerabilityResilience = req.body["Resilience to natural conditions"];
      let siteVulnerabilityCrimeRate = req.body["Crime rate"];
      let siteVulnerabilityPerception = req.body["Perception of Insecurity"];
      let siteVulnerabilityCommunityEngagement =  req.body['Participation in decision-making processes'];

      let architecturePhysicalNatureHouseQuality = req.body["Housing Quality"];
      let architecturePhysicalNatureMaterials  =  req.body["Materials"] ;
      let architecturePhysicalNatureDev = req.body["Development Stage"];
      let architectureInfrastructureEnergyAccess = req.body["Access to Energy"];
      let architectureInfrastructureEnergySource =   req.body["Energy Sources"] ;
      let architectureInfrastructureEnergySourceCook =   req.body["Energy source for cooking"] ;
      let architectureInfrastructureWaterAccess = req.body["Access to Water"] ;
      let architectureInfrastructureSanitationAccess = req.body["Access to Sanitation"] ;
      let architectureInfrastructureTelecom = req.body["Access to telecommunications"] ;
      let architectureInfrastructureInternetAccess = req.body["Access to Internet"] ;
      let architectureInfrastructureStreetState = req.body["Road network"] ;
      let architectureInfrastructuremobilityModes = req.body['Mobility Modes'];
      let architectureDensityElevation = req.body["Storeys per building"];
      let architectureDensityHouseHold  = req.body["Households"] ;
      let architectureDensitydwellingSize = req.body["Dwelling size"] ;

      let populaceLifeQualityhappiness = req.body['Level of happiness'];
      let populaceLifeQualityfood = req.body['Access to food'];
      let populaceLifeQualityProximity = req.body["Proximity to urban amenities"];
      let populaceLifeQualityAccesstoNaturalsettings = req.body['Access to green spaces'];
      let populaceLifeQualityHealthCare = req.body["Access to Health Care"] ;
      let populaceLifeQualityNumberOfHealthCareFacilities = req.body["Access to Health Care"];
      let populaceeconomyunemploymentRate =req.body['Unemployment Rate'];
      let populaceeconomyInformalSector =req.body['Employment in the formal sector']; 
      let populaceeconomypopulationIncome =req.body['Population income'];
      let populaceeconomyTenure =req.body["Tenure"];
      let populacedemographyGender=req.body["Gender Distribution"];
      let populacedemographyEthnicity=req.body["Ethnic Groups"];
      let populacedemographyageGroups =req.body['Age groups'];
      let populacedemographyEducation=req.body['Access to Education'];
      let populacedemographyNumberOfSchools=req.body["Number of Schools in the Community"];

      let settlementData = req.body

      User.findOne({secret: req.params.secret, contribution: req.params.contribution}, function(err, user){
        Settlement.findOne({
          _id: req.params.id,
        }).then((settlement) => {
          let coords = settlement['geolocation']['coordinates'];

          const koppenData = [];

          fs.createReadStream('./app/util/koppen_2010.csv').pipe(parse({ delimiter: ',' })).on('data', (data) => koppenData.push(data)).on('end', () => {

            let obj = indicator(settlementData, coords, koppenData)

          
            let informalityIndicator = obj['informality']
            let siteIndicator = obj['site']
            let architectureIndicator = obj['architecture']
            let populaceIndicator = obj['populace']

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
                    "communityEngagement": siteVulnerabilityCommunityEngagement
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
                  "sourceOfEnergyCook": architectureInfrastructureEnergySourceCook,
                  "accessToWater": architectureInfrastructureWaterAccess ,
                  "accessToSanitation": architectureInfrastructureSanitationAccess,
                  "accessToPhoneFare": architectureInfrastructureTelecom,
                  "accessToInternet": architectureInfrastructureInternetAccess,
                  "physicalStateOfStreets": architectureInfrastructureStreetState,
                  "mobilityModes":architectureInfrastructuremobilityModes ,
                },
                "density":{
                  "elevation": architectureDensityElevation,
                  "householdPerHouseSize":architectureDensityHouseHold,
                  "dwellingSize" : architectureDensitydwellingSize,
                }
              },
              "populace": {
      
                "qualityOfLife":{
                  "happiness": populaceLifeQualityhappiness,
                  "food": populaceLifeQualityfood,
                  "proximity": populaceLifeQualityProximity ,
                  "AccesstoNaturalsettings": populaceLifeQualityAccesstoNaturalsettings,
                  "accessToHealthCare":populaceLifeQualityHealthCare,
                  "numberOfHealthCareFacilities": populaceLifeQualityNumberOfHealthCareFacilities,
                },
                "economy":{
                  "unemploymentRate": populaceeconomyunemploymentRate,
                  "formalEmployment":populaceeconomyInformalSector,
                  "populationIncome" : populaceeconomypopulationIncome,
                  "tenure": populaceeconomyTenure,
      
                },
                "demography":{
                  "gender":populacedemographyGender,
                  "ethinicIdentities": populacedemographyEthnicity , 
                  "ageGroups":{          
                    "0-5years" :!isNaN(parseInt(req.body["0-5years"])) ?  parseInt(req.body["0-5years"])  : null,
                    "19-30years":!isNaN(parseInt(req.body["19-30years"]))?  parseInt(req.body["19-30years"]) : null,
                    "6-12years": !isNaN(parseInt(req.body["6-12years"])) ? parseInt(req.body["6-12years"]) : null,
                    "31-50years" : !isNaN(parseInt(req.body["31-50years"])) ?parseInt(req.body["31-50years"]) : null,
                    "13-18years": !isNaN(parseInt(req.body["13-18years"]))? parseInt(req.body["13-18years"]) : null ,
                    "50+years": !isNaN(parseInt(req.body["50+years"])) ? parseInt(req.body["50+years"]) : null
                  },
                  "accessToEducation": populacedemographyEducation,
                  "numberOfSchools" :populacedemographyNumberOfSchools
      
                }
              },
              "indicator": {
                "informalityIndicator": informalityIndicator,
                "siteIndicator": siteIndicator,
                "architectureIndicator": architectureIndicator,
                "populaceIndicator": populaceIndicator
              }
            },
            function(err){
              if (err){ console.log(err);}
            
              else{
              console.log("successfully updated");
              res.render("form", {
                sectionData: finalSurveyData,
                modalData : { 
                    description:"",
                    icons:[]
                },     
                modalClass : "modal-container-hide",
                previousModalData: "",
                previousModalClass : "previous-modal-container-hide",
                redirectUrl : "/shareknowledge/u/" + req.params.id + "/" +req.params.secret,
                url: "/api/final-survey/" + req.params.id + "/" +req.params.secret,
                notification:
                  'Already created a settlement? Edit it <a href = "/shareknowledge/u">here</a>',
                map: true,
                error: req.flash("form-error"),
                email: "",
              });
              }
          })
        })

          })



          
    })
  });

  router.post("/final-survey/:id/:secret",(req,res)=>{

     let finalSurvey = new Survey({
      settlementID: req.params.id,
      userSession:req.params.secret,
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
        { settlementId: req.params.id, email: req.body.email,formFieldName: req.body.formFieldName},
        { $set: {
          email: req.body.email,
          formFieldName: req.body.formFieldName,
          comment: req.body.comment
        } },
        { upsert: true },
        function(err, comment){

          if (err){
            console.log(err)
          }
          else{
            console.log("successfully saved comment")
          }
        }
      );
    })
  })

  router.post("/settlements/u/:id/:secret/image", upload.single("file"),function(req, res){

    console.log(req.body)
    console.log(req.file.path)



    // stored in the storage db like so, id/secret/formfieldname/imagename

    let filename  = req.file.path;
    let imageName = req.file.originalname;
    let formFieldName =  req.body.formFieldName;
    let secretSession = req.params.secret
    let id = req.params.id
    let destination = id + "/" + secretSession + "/"+ formFieldName + "/"  + imageName;

    async function uploadFile() {
      // Uploads a local file to the bucket
       let response = await storage.bucket(bucketName).upload(filename, {
        // By setting the option `destination`, you can change the name of the
        destination: destination,
        // object you are uploading to a bucket.
        metadata: {
          // Enable long-lived HTTP caching headers
          // Use only if the contents of the file will never change
          // (If the contents will change, use cacheControl: 'no-cache')
          cacheControl: 'no-cache',
        },
      });
  
      
      console.log(`${filename} uploaded to ${bucketName}.`);
      // // console.log(response)
      await storage.bucket(bucketName).file(destination).makePublic();
  
      console.log(`gs://${bucketName}/${filename} is now public.`);


      try {
        fs.unlinkSync(req.file.path);
        console.log("file removed")
      } catch(err) {
        console.error(err)
      }

      let imageUrl= response[0].metadata.mediaLink;
      console.log("here is the image url",imageUrl)

      if (imageUrl){

        User.findOne({secret: req.params.secret, contribution: req.params.contribution}, function(err, user){
          Image.updateOne(
            { settlementId: req.params.id, email: req.body.email,formFieldName: req.body.formFieldName},
            { $set: {
              email: req.body.email,
              formFieldName: req.body.formFieldName,      
            }, $push:{image: {name:destination,url:imageUrl}}},
            { upsert: true },
            function(err){
              if (err){
                console.log(err)
              }
              else{
                console.log("successfully saved image url")
              }
            }
          );
        })

      }else{

        console.log("failed to upload file")
      }
    }
    uploadFile().catch(console.error);
  })


  router.post("/settlements/u/:id/:secret/deleteimg",function(req, res){

    console.log("req.body",req.body)
    let imageUrl = req.body.imageUrl;
    let name =  req.body.imageName


    async function deleteFile() {
      // Deletes the file from the bucket
      await storage.bucket(bucketName).file(name).delete();
  
      console.log(`gs://${bucketName}/${name} deleted.`);
    }
  
    deleteFile().catch(console.error);

    User.findOne({secret: req.params.secret, contribution: req.params.contribution}, function(err, user){
          Image.updateOne(
            { settlementId: req.params.id, email: req.body.email,formFieldName: req.body.formFieldName},
            { $pull:{image: {name:name,url:imageUrl}}},
            { upsert: true },
            function(err){
              if (err){
                console.log(err)
              }
              else{
                console.log("successfully deleted image from database")
              }
            }
          );
        })
      }
  )


  router.post("/settlements/u/:id/:secret/link", function(req, res){
    User.findOne({secret: req.params.secret, contribution: req.params.contribution}, function(err, user){
      Link.updateOne(
        { settlementId: req.params.id, email: req.body.email,formFieldName: req.body.formFieldName},
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

  router.post("/user/subscribe",function(req,res){

    let sub = new Subscriber({email:req.body.email,subscribed:true});
    sub.save((err)=>{if (err) {console.log(err)}else{console.log("saved")}});

  });
  router.post("/user/unsubscribe",function(req,res){
    Subscriber.updateOne({email:req.body.email},{$set:{subscribed:false}},function(err,user){
      if (err){console.log(err)}
      else{
        //console.log(user.email + "subscribed");
      }
    })

  })
  return router;
};


