require("dotenv").config();

let express = require("express"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  cookieParser = require("cookie-parser"),
  session = require("express-session"),
  snapPointsToGrid = require("./app/util/snapPointsToGrid.js"),
  MongoStore = require("connect-mongo")(session);

let app = express(),
  router = express.Router();


const { information } = require("./00infromationdefs.js");

const {modalData,sectionDataContainer,aboutPageData,previousSettlementModal, finalSurveyData} = require("./data.js");

const PORT = process.env.PORT || 3000,
  DB_URL = `mongodb+srv://${process.env.MONGODB_USERNAME}:${encodeURIComponent(
    process.env.MONGODB_PASSWORD
  )}@cluster0-d6pne.mongodb.net/the_power_of_without?retryWrites=true&w=majority`,
  APP_DB_URL = `mongodb+srv://${process.env.APP_MONGODB_USERNAME}:${process.env.APP_MONGODB_PASSWORD}@cluster1.oxiff.mongodb.net/test?retryWrites=true&w=majority`;
// const PORT = process.env.PORT || 3000,
//       DB_URL = `mongodb+srv://hillaryt:${encodeURIComponent("tapiwa")}@cluster0-d6pne.mongodb.net/the_power_of_without?retryWrites=true&w=majority`,
//       APP_DB_URL = `mongodb+srv://hillaryt:tapiwa@cluster1.oxiff.mongodb.net/test?retryWrites=true&w=majority`;
// ** SETUP **
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("views", "./views");
app.set("view engine", "pug");

// ** CONNECT TO DB **
const main_conn = mongoose.createConnection(DB_URL),
  app_conn = mongoose.createConnection(APP_DB_URL),
  Settlement = require("./app/db/models/Settlement")(main_conn),
  User = require("./app/db/models/User")(main_conn),
  Comment = require("./app/db/models/Comment")(main_conn),
  Link = require("./app/db/models/Link")(main_conn),
  Survey = require("./app/db/models/Survey")(main_conn),
<<<<<<< HEAD
  Image = require("./app/db/models/Image")(main_conn),
  Pin = require("./app/db/models/Pin")(app_conn);
=======
  Pin = require("./app/db/models/Pin")(app_conn), 
  Country=require("./app/db/models/Country")(main_conn);
>>>>>>> 4ef68f4dd10b2ea1627529809ac485233b33f229

app.use(
  session({
    secret: "cookie key",
    store: new MongoStore({ mongooseConnection: main_conn }),
  })
);
app.use(cookieParser());
app.use(flash());

// ** ROUTES **
app.get("/", function (req, res) {
  res.render("index");
});

app.get("/contribute", function (req, res) {

  res.render("form", {
    sectionData: sectionDataContainer,
    modalData : modalData,
    modalClass : "modal-container-hide",
    previousModalData: previousSettlementModal,
    previousModalClass : "previous-modal-container-hide",
    redirectUrl : "/contribute",
    url: "/api/settlements",
    notification:
      'Already created a settlement? Edit it <a href = "/contribute/u">here</a>',
    map: true,
    error: req.flash("form-error"),
  });
});

app.get("/contribute/u/", function (req, res) {
  // Find settlement that you've already created
  let sections = [
    {
      label: "",
      questions: [
        {
          label: "Name of the Informal Settlement",
          name: "settlement",
          type: "text",
        },
        {
          label: "Name of the City",
          name: "city",
          type: "text",
        },
        {
          label: "Email Address",
          name: "email",
          type: "text",
        },
      ],
    },
  ];
  res.render("form", {
    sections: sections,
    url: "/api/get-settlement",
    modalData : { 
      description:"",
      icons:[]
   },     
    modalClass : "modal-container-hide",
    previousModalData: previousSettlementModal,
    previousModalClass : "previous-modal-container-hide",
    notification: req.flash("form-notification"),
    error: req.flash("form-error"),
  });
});

app.get("/contribute/u/:contribution/:secret", function (req, res) {
  // Update the settlement
  User.findOne(
    { secret: req.params.secret, contribution: req.params.contribution },
    function (err, user) {
      Settlement.findOne({ _id: user.contribution }, function (
        err,
        settlement
      ) {
        // console.log(settlement);
        function getFormValue(tree) {
          // Given the location of a field in a schema (i.e. ["site", "origin", "causes"]), return its value or null if it doesnt exist
          let val = settlement;
          tree.forEach(function (t) {
            if (t in val) val = val[t];
            else return null;
          });
          
          return val;
        }
        // console.log(getFormValue(["site", "origin", "causes"]));
        

        var minutes = ["0min"];
        for (let i =1 ; i< 20;i++){
          let stringI = i.toString();      
          minutes.push(stringI)
        }
        minutes = minutes.concat(["20min or more"])
        var clinics = ["0"];
        for (let i =1 ; i< 6;i++){
          let stringI = i.toString();      
          clinics.push(stringI)
        }
        clinics = clinics.concat(["6 or more"])


        var percent = []   
        for (let i =0 ; i< 101;i++){
          let stringI = i.toString();      
          percent.push(stringI+"%")
        }

        var differences = []
        for (let i =0 ; i< 101;i++){
          let string1 = i.toString(); 
          let string2 = (100-i).toString();
          differences.push([ string1 +  "% Male" , string2 + "% Female"])
        }
        var households = []
        for (let i =0 ; i< 6;i++){
          let stringI = i.toString();      
          households.push(stringI)
        }
        households =households.concat(["10 or more"])
        var floors = []
        for (let i =1 ; i< 6;i++){
          let stringI = i.toString();      
          floors.push(stringI)
        }
        floors =floors.concat(["6 or more"])
        // console.log(minutes);
        // console.log(clinics);
        // console.log(percent);
        // console.log(differences);
        let sectionDataContainer = {
          // Site
          header: "update-settlement",

          sections: [
            {
              section: "Site",
              subsections: [
                {
                  label: "ORIGIN",
                  questions: [
                    {

                      name: "Causes",
                      id:"causes",
                      type: "radio",
                      options: [
                        "Squatting",
                        "Refugee Camp",
                        "Illegal Subdivision",
                        "Other",
                      ],
                      value: getFormValue(["site", "origin", "causes"]),
                      info: information["Origin"]
                        ,
                    },
                    {
                      name: "Population",
                      id:"population",
                      type: "text",
                      info: information["Population"],
                      value: getFormValue(["site", "origin", "population"]),
                      placeholder : "Number"
                    },
                  ],
                },
                {
                  label: "GEOGRAPHY",
                  questions: [
                    {
                      name: "Topography Feautures",
                      id:"topographyFeatures",
                      type: "radio",
                      options: [
                        "Dessert",
                        "Water",
                        "By the Coast",
                        "Valley",
                        "Mountain",
                        "Forest",
                        "Other",
                      ],
                      value: getFormValue(["site", "geography", "topography"]),
                      info:information["Topography features"]
                    },
                    {
                      name: "Location within the city",
                      id:"cityLocation",
                      type: "radio",
                      options: [
                        "Squatting on the fringe",
                        "In the path of development",
                        "In the heart of the city",
                        "Along railway tracks",
                        "Residential Centers",
                        "Old City Slum",
                        "Rural Area",
                        "Other",
                      ],
                      value: getFormValue(["site", "geography", "withinCities"]),
                      info:information["Location within the city"]
                    },
                  ],
                },
                {
                  label: "VULNERABILITY",
                  questions: [
                    {
                      name: "Resilience to natural conditions",
                      id:"vulnerability",
                      type: "range",
                      options: ["Low","High"],
                      value: getFormValue(["site", "vulnerability", "resilienceToNaturalConditions"]),
                      info: information["Resilience to natural conditions"]
                    },
                    {
                      name: "Crime rate",
                      id:"crimeRate",
                      type: "range",
                      options:  ["Low","High"],
                      value: getFormValue(["site", "vulnerability", "crimeRate"]),
                      info: information["Crime Rate"]
                    },


                    {
                      name: "Perception of Insecurity",
                      id:"perceptionOfInsecurity",
                      type: "range",
                      options:  ["Low","High"],
                      value:  getFormValue(["site", "vulnerability", "perceptionOfInsecurity"]),
                      info:information["Personal perception of insecurity"]
                    },
                    {
                      name: "Participation in decision-making processes",
                      id:"decisionMaking",
                      type: "range",
                      options:  ["Low","High"],
                      value:  getFormValue(["site", "vulnerability", "communityEngagement"]),
                      info:information["Participation in decision-making processes"]                      

                    }
                  ],
                },
              ],
            },{

              section: "Architecture",
              subsections:[

                { label : "PHYSICAL NATURE",
                  questions : [

                    { name :"House Quality", 
                      id: "houseQuality",
                      type : "range",
                      options:  ["Inadequate","Optimal"],
                      value: getFormValue(["architecture", "physicalNature", "houseQuality"]),
                      info:information["House quality"]
                    },{
                       name : "Materials",
                       id:"materials",
                       type : "radio",
                       options : ["Mud", "Brick","Concrete","Wood","Corrugated sheet", "Tarpaulin / Tensile structures", "Cardboard","Other"], //Modified
                       value: getFormValue(["architecture", "physicalNature", "materials"]),
                       info:information["Materials"]            
                    },{
                        name: "Development Stage",
                        id:"devStage",
                        type:"range",
                        options:["Temporary","Established"],
                        value:getFormValue(["architecture", "physicalNature", "developmentState"]),
                        info:information["Materials"] 
                    }
                  ]
                },{
                  label: "INFRASTRUCTURE",
                  questions:[{
                    name:"Access to Energy",
                    id:"energyAccess",
                    type:"range",
                    options : ["Low","High"],
                    value: getFormValue(["architecture", "infrastructure", "accessToEnergy"]),
                    info:information["Access to Energy"]
                  },
                  { 
                    name : "Source of Energy",
                    id:"energySource",
                    type:"radio",
                    options:["Coal","Wood","Gas","Electricity","Other"],
                    value: getFormValue(["architecture", "infrastructure", "sourceOfEnergy"]),
                    info:information["Access to Energy"]

                  },{
                    name : "Access to Water",
                    id:"waterAccess",
                    type : "double-range",
                    options : ["Low","High","Public","Private"],
                    value: getFormValue(["architecture", "infrastructure", "accessToWater"]),
                    info:information["Access to Water"]                  
                  },{
                    name : "Access to Sanitation",
                    id:"sanitationAccess",
                    type : "double-range",
                    options : ["Low","High","Communal","Private"], //Updated
                    value: getFormValue(["architecture", "infrastructure", "accessToSanitation"]),
                    info:information["Access to sanitation"]
                  },{
                    name:"Internet Access",
                    id:"internetAccess",
                    type :"range",
                    options : ["Low","High"],
                    value: getFormValue(["architecture", "infrastructure", "accessToInternetOrPhoneFare"]),
                    info:information["Access to internet"]
                  },
                  {
                    name:"Road network",
                    id:"roadNetwork",
                    type :"range",
                    options : ["Not Paved","Paved"],
                    value: getFormValue(["architecture", "infrastructure", "physicalStateOfStreets"]),
                    info:information["Physical state Of the streets"] 
                  },{
                    name:"Mobility Modes",
                    id: "mobilityModes",
                    type :"radio",
                    options : ["Walking","Biking", "Animal", "Informal transportation, microbuses","Informal transportation, tuctuc","Car","By Public Transportation","Other"], //added
                    value: getFormValue(["architecture", "infrastructure", "MobilityModes"]),
                    info:information["Mobility Modes"]

                  }
                ]
                },{
                  label: "DENSITY",
                  questions:[
                    {
                      name : "Building levels",
                      id:"buildingLevels",
                      type : "range",
                      options : floors,
                      value: getFormValue(["architecture", "density", "elevation"]),
                      info:information["Elevation"]
                    },
                    {
                      name : "Households",
                      id: "households",
                      type : "range",
                      options : households,
                      value: getFormValue(["architecture", "density", "Households"]),
                      info:information["Households"]
                    },
                    {
                      name : "Dwelling size", //New!! question

                      id : "dwellingSize",
                      type : "range",
                      options : households, ////New!!
                      value: getFormValue(["architecture", "density", "Dweling size"]), ////New!!
                      info:information["Dweling size"] ////New!!
                    }


                  ]

                }
              ]
            },{
              section : "POPULACE",
              subsections : [

                { label : "QUALITY OF LIFE",
                  questions : [
         
                    {
                      name : "Proximity to public areas of leisure activities",
                      id : "publicProximity",
                      type :"range",
                      options: minutes,
                      value:  getFormValue(["populace", "qualityOfLife", "proximity"]),
                      info:information["Distance to public areas"]
                   }
                   ,
                   {
                      name : "Access to Natural settings",////New!!
                      id: "naturalSettingsAccess",
                      type :"range",
                      options: minutes,
                      value:  getFormValue(["populace", "qualityOfLife", "AccesstoNaturalsettings"]),////New!!
                      info:information["Access to Natural settings"]////New!!
                    },
                    {
                      name : "Access to Health Care",
                      id : "healthCareAccess",
                      type :"range",
                      options: ["Low","High"],
                      value:  getFormValue(["populace", "qualityOfLife", "accessToHealthCare"]),
                      info:information["Access to Health Care"]
                    },
                    {
                      name : "Number of Hospitals, Clinics or Health Cares",
                      id : "hospitalNumber",
                      type :"range",
                      options: clinics,
                      value:  getFormValue(["populace", "qualityOfLife", "numberOfHealthCareFacilities"]),
                      info:information["HealthCare Facilities"]
                    },                      
                    {
                      name : "Access to Education",
                      id : "educationAccess",
                      type:"range",
                      options : ["Low" ,"High"],
                      value:getFormValue(["populace", "qualityOfLife", "accessToEducation"]),
                      info:information["Access to Education"]
                    },
                    {
                      name : "Number of Schools in the Community",
                      id : "schoolsNumber",
                      type:"range",
                      options : clinics,
                      value:getFormValue(["populace", "qualityOfLife", "numberOfSchools"]),
                      info: information["Number of Schools in the Community"]
                    }                     
                    ,{
                      name :"Unemployment Rate",
                      id : "unemploymentRate",
                      type:"range",
                      options:["Low","High"],
                      value:getFormValue(["populace", "qualityOfLife", "unemploymentRate"]),
                      info:information["Unemployment rate"]
                    },{
                      name:"Employment in the formal sector",
                      id : "formalEmployment",
                      type:"range",
                      options :percent,
                      value: getFormValue(["populace", "qualityOfLife", "employmentInTheInformalSector"]),
                      info:information["Employment in the formal sector"]
                    },{
                      name:"Population income", //New
                      id : "populationIncome",
                      type:"range",
                      options :percent,
                      value: getFormValue(["populace", "qualityOfLife", "Populationincome"]),//New
                      info:information["Population income"]//New
                    },{
                      name :"Tenure",//Updated
                      id : "tenure",
                      type:"range",
                      options :["No entitlement","Entitlement"], //New
                      value:  getFormValue(["populace", "qualityOfLife", "Tenure"]),//Updated
                      info:information["Tenure"]  //Updated
                    },{
                      name : "Age Distribution",//Updated
                      type:"grid",
                      id:"ageGroups",
                      options :[[{label:"0-5 years",id:"0-5years",value:getFormValue(["populace", "qualityOfLife", "ageGroups","0-5years"])},
                      {label:"19-30 years",id:"19-30years",value:getFormValue(["populace", "qualityOfLife", "ageGroups","19-30years"])}],
                      [{label:"6-12 years",id:"6-12years",value:getFormValue(["populace", "qualityOfLife", "ageGroups","6-12years"])},
                      {label:"31-50 years",id:"31-50years",value:getFormValue(["populace", "qualityOfLife", "ageGroups","31-50years"])}],
                      [{label:"13-18 years",id:"13-18years",value:getFormValue(["populace", "qualityOfLife", "ageGroups","13-18years"])},
                      {label:"50 or more",id:"50+years",value:getFormValue(["populace", "qualityOfLife", "ageGroups","50+years"])}]],
                      info:information["Age Distribution"]//Updated
                    },{
                      name : "Gender Distribution", //Updated
                      type:"range",
                      id:"gender",
                      options : differences,
                      value:getFormValue(["populace", "qualityOfLife", "GenderDistribution"]),//Updated
                      info:information["Gender Distribution"] //Updated
                    },
                    {
                      name:"Ethnic Groups",//Updated
                      id  : "ethinicIdentities",
                      type:"text",
                      placeholder:"Your Comment",
                      value:getFormValue(["populace", "qualityOfLife", "ethinicIdentities"]),//Updated
                      info:information["Ethnic Groups"]//Updated
                    }
                    
                  ]  
                }
              ]       
            }
          ],
        };

        Promise.all([
          Comment.find({
            settlementId: user.contribution,
          }),
          Link.find({
            settlementId: user.contribution,
          }),
        ]).then(function (data) {
          res.render("form", {
            settlement: settlement,
            comments: data[0],
            links: data[1],
            sectionData: sectionDataContainer,
            modalData : { 
                description:"",
                icons:[]
            },     

            modalClass : "modal-container-hide",
            previousModalData: previousSettlementModal,
            previousModalClass : "previous-modal-container-hide",
            redirectUrl:"",
            notification: req.flash("form-notification"),
            url:
              "/api/settlements/u/" +
              user.contribution +
              "/" +
              req.params.secret,
            error: req.flash("form-error"),
            email: user.email,
            finalSurveyData:""
          });
        });
      });
    }
  );
});

app.get("/toolkit", function (req, res) {
  res.render("toolkit");
});

app.get("/about", function (req, res) {
  res.render("about",{
  aboutInfo:aboutPageData
}
  );
});

// app.get("/final-survey",function(req,res){

//   res.render("form", {
//     settlement: "",
//     comments: "",
//     links: "",
//     sectionData:"",
//     modalData : { 
//         description:"",
//         icons:[]
//     },     
//     modalClass : "modal-container-hide",
//     previousModalData: "",
//     previousModalClass : "previous-modal-container-hide",
//     redirectUrl:"",
//     notification: req.flash("form-notification"),
//     url:"",
//     error: req.flash("form-error"),
//     email: "",
//     finalSurveyData:finalSurveyData

//   });
// })





app.get("/map", function (req, res) {
  Promise.all([Settlement.find({}), Pin.find({})]).then(function (data) {
    let settlements = data[0],
      pins = data[1];

    // Snap Pins
    pins = pins.map(function (d, i) {
      d.pin.coordinates = snapPointsToGrid(
        d.pin.coordinates[1],
        d.pin.coordinates[0]
      );
      return d;
    });

    // Aggregate settlements by country
    let countries = {};

    settlements.forEach(function (settlement) {
      if (!(settlement.country in countries))
        countries[settlement.country] = [];
      countries[settlement.country].push(settlement);
    });

    res.render("map", {
      settlements: settlements,
      countries: countries,
      pins: pins,
    });
  });
});

app.use(
  "/api",
<<<<<<< HEAD
  require("./app/routes/api.js")(User, Settlement, Survey, Pin, Comment, Link,Image)
=======
  require("./app/routes/api.js")(User, Settlement, Survey, Pin, Comment, Link, Country)
>>>>>>> 4ef68f4dd10b2ea1627529809ac485233b33f229
);

// ** START THE SERVER **

app.listen(process.env.PORT||PORT);
console.log("Running on http://127.0.0.1:" + process.env.PORT);
module.exports = app;
