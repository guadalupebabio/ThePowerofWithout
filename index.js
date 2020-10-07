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

const {aboutPageData,previousSettlementModal} = require("./data.js");

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
  Link = require("./app/db/models/Link")(main_conn);
Pin = require("./app/db/models/Pin")(app_conn);

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
  // Create the initial settlement
  // let sections = [

  let sectionDataContainer = {
    header: "fill-in-form",
    sections: [
      {
        label: "Name of the City",
        name: "city",
        type: "text",
        value: "City",
      },
      {
        label: "Name of the Informal Settlement",
        name: "settlement",
        type: "text",
        value: "Settlements",
      },
      {
        label: "Settlement Location (Set a point on the map)",
        name: "geolocation",
        type: "coords",
        value: "Select a point on the map",
      },
      {
        label: "Email Address",
        name: "email",
        type: "text",
        value: "somebody@example.com",
      },
      {
        label: "Privacy Statement",
        name: "privacy-checkbox",
        type: "checkbox",
        value:
          "By submitting your email address, you consent to us keeping you informed about updates to our website and about other products and services that we think might interest you.\
         You can unsubscribe at any time. Please read our Privacy Statement and Terms & Conditions.",
        options: [
          "By submitting your email address, you consent to us keeping you informed about updates to our website and about other products and services that we think might interest you.\
        You can unsubscribe at any time. Please read our Privacy Statement and Terms & Conditions.",
        ],
      },
    ],
  };

  let modalData = {

    description:
      "Thank you for taking the time to fill the survey!  When you continue to the next section,\
       an email will be sent to your account with a link that will allow you to complement or update your responses at any time after you close this window.\
      This is the fist time we are sharing this platform so we very much appreciate any feedback that will help us improve our work.\
       Since every question informs a different part of the taxonomy it is very important that we ask for feedback on each one individually, but \
       this questions are optional. You will be finding along with each questions a series of icons that represent the following and whose responses are unequly \
       link to the question they belong to.",
    icons: [
      {
        image: "./assets/error_outline_24px.png",
        description: "Defines what it is asked in the questions",
      },
      {
        image: "./assets/chat_24px.png",
        description: "Provide feedback about the question (relevance, accuracy, ect) ",
      },

      {
        image: "./assets/link_24px.png",
        description: "Paste any link or reference that might be relevant or informed your response",
      },

      {
        image: "./assets/add_photo_alternate_24px.png",
        description: "Attached a picture if it can be used to back up the reponse provided (not available)",
      },
    ],
  };

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
        console.log(settlement);
        function getFormValue(tree) {
          // Given the location of a field in a schema (i.e. ["site", "origin", "causes"]), return its value or null if it doesnt exist
          let val = settlement;
          tree.forEach(function (t) {
            if (t in val) val = val[t];
            else return null;
          });
          
          return val;
        }
        console.log(getFormValue(["site", "origin", "causes"]));
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
                      type: "range",
                      options: ["Low","High"],
                      value: getFormValue(["site", "vulnerability", "resilienceToNaturalConditions"]),
                      info: information["Resilience to natural conditions"]
                    },
                    {
                      name: "Crime rate",
                      type: "range",
                      options:  ["Low","High"],
                      value: getFormValue(["site", "vulnerability", "crimeRate"]),
                      info: information["Crime Rate"]
                    },
                    {
                      name: "Perseption of Insecurity",
                      type: "range",
                      options:  ["Low","High"],
                      value:  getFormValue(["site", "vulnerability", "perceptionOfInsecurity"]),
                      info:information["Personal perception of insecurity"]
                    },
                    {
                      name: "Prevalence",
                      type: "range",
                      options:  ["Low","High"],
                      value: getFormValue(["site", "vulnerability", "prevalance"]),
                      info:information["Prevalence"]
                    },
                  ],
                },
              ],
            },{

              section: "Architecture",
              subsections:[

                { label : "PHYSICAL NATURE",
                  questions : [

                    { name :"House Quality", 
                      type : "range",
                      options:  ["Low","High"],
                      value: getFormValue(["architecture", "physicalNature", "houseQuality"]),
                      info:information["House quality"]
                    },{
                       name : "Materials",
                       type : "radio",
                       options : ["Mud", "Brick","Concrete","Wood","Corrugates", "Sheet", "Tarpaulin", "Tiles","Other"],
                       value: getFormValue(["architecture", "physicalNature", "materials"]),
                       info:information["Materials"]            
                    },{
                        name: "Development State",
                        type:"range",
                        options:["Initial","Established"],
                        value:getFormValue(["architecture", "physicalNature", "developmentState"]),
                        info:information["Materials"] 
                    }
                  ]
                },{
                  label: "INFRASTRUCTURE",
                  questions:[{
                    name:"Access to Energy",
                    type:"range",
                    options : ["Low","High"],
                    value: getFormValue(["architecture", "infrastructure", "accessToEnergy"]),
                    info:information["Access to Energy"]
                  },
                  { 
                    name : "Source of Energy",
                    type:"radio",
                    options:["Coal","Wood","Gas","Electricity","Other"],
                    value: getFormValue(["architecture", "infrastructure", "sourceOfEnergy"]),
                    info:information["Access to Energy"]

                  },{
                    name : "Access to Water",
                    type : "double-range",
                    options : ["Low","High","Public","Private"],
                    value: getFormValue(["architecture", "infrastructure", "accessToWater"]),
                    info:information["Access to Water"]                  
                  },{
                    name : "Access to Sanitation",
                    type : "double-range",
                    options : ["Low","High","Public","Private"],
                    value: getFormValue(["architecture", "infrastructure", "accessToSanitation"]),
                    info:information["Access to sanitation"]
                  },{
                    name:"Access to Internet",
                    type :"range",
                    options : ["Low","High"],
                    value: getFormValue(["architecture", "infrastructure", "accessToInternetOrPhoneFare"]),
                    info:information["Access to internet"]
                  },
                  {
                    name:"Physical State of the Streets",
                    type :"range",
                    options : ["Low","High"],
                    value: getFormValue(["architecture", "infrastructure", "physicalStateOfStreets"]),
                    info:information["Physical state Of the streets"] 
                  },{
                    name:"Mobility Systems",
                    type :"radio",
                    options : ["Walking","Biking", "By Car","By Public Transport","Other"],
                    value: getFormValue(["architecture", "infrastructure", "mobilitySystems"]),
                    info:information["Mobility systems"]

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
                      name : "Household per house",
                      type : "range",
                      options : ["1","5","10 or more"],
                      value: getFormValue(["populace", "qualityOfLife", "householdPerHouseSize"]),
                      info:information["House holds per house"]
                    },{
                      name : "Access to Health Care",
                      type :"range",
                      options: ["Low","High"],
                      value:  getFormValue(["populace", "qualityOfLife", "accessToHealthCare"]),
                      info:information["Access to Health Care"]
                    },{
                      name : "Access to Education",
                      type:"range",
                      options : ["Low,High"],
                      value:getFormValue(["populace", "qualityOfLife", "accessToEducation"]),
                      info:information["Access to Education"]
                    },{

                      name :"Unemployment Rate",
                      type:"range",
                      options:["Low","High"],
                      value:getFormValue(["populace", "qualityOfLife", "unemploymentRate"]),
                      info:information["Unemployment rate"]
                    },{
                      name:"Employment in the formal sector",
                      type:"range",
                      options : ["0%","100%"],
                      value: getFormValue(["populace", "qualityOfLife", "employmentInTheInformalSector"]),
                      info:information["Employment in the formal sector"]
                    },{
                      name :"Ownership",
                      type:"range",
                      options :["Illegal","Community/City Property","Private"],
                      value:  getFormValue(["populace", "qualityOfLife", "ownershipRights"]),
                      info:information["Ownership"]  
                    },{
                      name : "Age groups",
                      type:"range",
                      options :["10","20","30","40","50",">60"],
                      value: getFormValue(["populace", "qualityOfLife", "ageGroups"]),
                      info:information["Age groups"]
                    },{
                      name : "Gender",
                      type:"range",
                      options : ["Male","Female"],
                      value:getFormValue(["populace", "qualityOfLife", "gender"]),
                      info:information["Gender"]
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
  require("./app/routes/api.js")(User, Settlement, Pin, Comment, Link)
);

// ** START THE SERVER **

app.listen(process.env.PORT||PORT);
console.log("Running on http://127.0.0.1:" + process.env.PORT);
module.exports = app;
