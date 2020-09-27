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
        function getFormValue(tree) {
          // Given the location of a field in a schema (i.e. ["site", "origin", "causes"]), return its value or null if it doesnt exist
          let val = settlement;
          tree.forEach(function (t) {
            if (t in val) val = val[t];
            else return null;
          });
          return val;
        }
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
                      info:
                        "Related to the point or place where the settlement begins, arises or derived",
                    },
                    {
                      name: "Population",
                      type: "text",
                      info: "Feedback from the population question",
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
                      value: getFormValue(["site", "origin", "causes"]),
                      info:
                        "Related to the point or place where the settlement begins, arises or derived",
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
                      value: getFormValue(["site", "origin", "causes"]),
                      info:
                        "Related to the point or place where the settlement begins, arises or derived",
                    },
                  ],
                },
                {
                  label: "VULNERABILITY",
                  questions: [
                    {
                      name: "Resiliance to natural conditions",
                      type: "range",
                      options: ["Low","High"],
                      value: getFormValue(["site", "origin", "causes"]),
                      info:
                        "Related to the point or place where the settlement begins, arises or derived",
                    },
                    {
                      name: "Crime rate",
                      type: "range",
                      options:  ["Low","High"],
                      value: getFormValue(["site", "origin", "causes"]),
                      info:
                        "Related to the point or place where the settlement begins, arises or derived",
                    },
                    {
                      name: "Perseption of Insecurity",
                      type: "range",
                      options:  ["Low","High"],
                      value: getFormValue(["site", "origin", "causes"]),
                      info:
                        "Related to the point or place where the settlement begins, arises or derived",
                    },
                    {
                      name: "Prevalence",
                      type: "range",
                      options:  ["Low","High"],
                      value: getFormValue(["site", "origin", "causes"]),
                      info:
                        "Related to the point or place where the settlement begins, arises or derived",
                    },
                  ],
                },
              ],
            },
          ],
        };

        // Architecture
        // [
        //   {
        //     label: "House quality",
        //     name: "architecturePhysicalNatureHouseQuality",
        //     type: "radio",
        //     value: getFormValue(["architecture", "physicalNature", "houseQuality"]),
        //     options: ["Inadequate", "Suitable", "Optimal"]
        //   },
        //   {
        //     label: "Materials from which the house in the Settlement is made with",
        //     name: "architecturePhysicalNatureMaterials",
        //     type: "checkbox",
        //     value: getFormValue(["architecture", "physicalNature", "materials"]),
        //     options: ["Mud", "Brick", "Wood", "Concrete", "Corrugated sheet", "Tarpaulin", "Tiles", "Other"],
        //   },
        //   {
        //     label: "Development State",
        //     name: "architecturePhysicalNatureDevelopmentState",
        //     type: "radio",
        //     value: getFormValue(["architecture", "physicalNature", "developmentState"]),
        //     options: ["Initial occupancy", "Transitional", "Establish"],
        //     info: "Stage of the evolution process where the Settlement is into"
        //   },
        //   {
        //     label: "Access to Energy",
        //     name: "architectureInfrastructureAccessEnergy",
        //     type: "radio",
        //     value: getFormValue(["architecture", "infrastructure", "accessToEnergy"]),
        //     options: ["0-10%", "10-25%", "25-50%", ">50%"],
        //     info: "Percentage of dwellings that have access to power/electricity in the Settlement"
        //   },
        //   {
        //     label: "Access to Water",
        //     name: "architectureInfrastructureAccessWater",
        //     type: "radio",
        //     value: getFormValue(["architecture", "infrastructure", "accessToWater"]),
        //     options: ["0-10%", "10-25%", "25-50%", ">50%"],
        //     info: "Percentage of dwellings that have access to drinking water in the Settlement"
        //   },
        //   {
        //     label: "Access to Sanitation",
        //     name: "architectureInfrastructureAccessSanitation",
        //     type: "radio",
        //     value: getFormValue(["architecture", "infrastructure", "accessToSanitation"]),
        //     options: ["0-10%", "10-25%", "25-50%", ">50%"],
        //     info: "Percentage of dwellings that have access to sanitation in the Settlement"
        //   },
        //   {
        //     label: "Access to Internet or Phone Fare",
        //     name: "architectureInfrastructureAccessInternet",
        //     type: "radio",
        //     value: getFormValue(["architecture", "infrastructure", "accessToInternetOrPhoneFare"]),
        //     options: ["0-10%", "10-25%", "25-50%", ">50%"],
        //     info: "Percentage of people that has access to data-plans or phone fare"
        //   },
        //   {
        //     label: "Mobility systems",
        //     name: "architectureMobility",
        //     type: "checkbox",
        //     value: getFormValue(["architecture", "infrastructure", "mobilitySystems"]),
        //     options: ["Walk", "Bike", "Car", "Public transportation"],
        //     info: "Mobility systems used by the people in the Settlement"
        //   },
        //   {
        //     label: "Average number of floors in the buildings",
        //     name: "architectureDensityElevation",
        //     type: "radio",
        //     value: getFormValue(["architecture", "density", "averageFloors"]),
        //     options: ["1", "2", "3", ">3"]
        //   },
        //   {
        //     label: " Number of people living in a house",
        //     name: "architectureDensityHouseholdPerHouseSize",
        //     value: getFormValue(["architecture", "density", "householdPerHouseSize"]),
        //     type: "text"
        //   },
        // ],

        // Population
        // [
        //   {
        //     label: "Health Care: Percentage of people that has access to health care",
        //     name: "populaceHealthCare",
        //     type: "radio",
        //     options: ["0-10%", "10-25%", "25-50%", ">50%"],
        //     value: getFormValue(["populace", "accessToHealthCare"]),
        //   },
        //   {
        //     label: "Number of hospitals, clinics or health cares in the Settlement",
        //     name: "populaceHospitals",
        //     type: "text",
        //     value: getFormValue(["populace", "numberHospitals"]),
        //   },
        //   {
        //     label: "Education: Percentage of people that has access to schools/ Percentage of people attending to schools",
        //     name: "populaceEducation",
        //     type: "radio",
        //     options: ["0-10%", "10-25%", "25-50%", ">50%"],
        //     value: getFormValue(["populace", "accessToEducation"]),
        //   },
        //   {
        //     label: "Number of schools in the settlement",
        //     name: "populaceSchools",
        //     type: "text",
        //     value: getFormValue(["populace", "numberSchools"]),
        //   },
        //   {
        //     label: "Proximity to public areas or leisure activities",
        //     name: "populacePublicAreas",
        //     type: "radio",
        //     options: ["5 min walking distance", "5-20 min walking distance", ">20 min walking distance", "I need to take a car/public transportation"],
        //     value: getFormValue(["populace", "publicAreas"]),
        //   },
        //   {
        //     label: "Unemployment rate",
        //     name: "populaceUnemploymentRate",
        //     type: "text",
        //     value: getFormValue(["populace", "unemploymentRate"]),
        //   },
        //   {
        //     label: "Ownership: Level of rights that the householder has on possessing the land at the Settlement",
        //     name: "populaceOwnership",
        //     type: "radio",
        //     options: ["Community/city property", "Private house", "Illegal"],
        //     value: getFormValue(["populace", "ownershipRights"]),
        //   },
        //   // {
        //   //   label: "Ethnic and racial categories in the Settlement",
        //   //   name: "populaceEthnic",
        //   //   type: "text",
        //   // },
        //   // {
        //   //   label: "Demography: Percentage of people in each age groups in the Settlement",
        //   //   name: "populaceDemography",
        //   //   type: "text",
        //   // },
        // ]
        // ];
        // let sections = [
        //   // Site
        //   [
        //     {
        //       label: "Origin",
        //       name: "siteOriginCauses",
        //       type: "radio",
        //       options: ["Squatting", "Refugee Camp", "Illegal Subdivision", "Other"],
        //       value: getFormValue(["site", "origin", "causes"]),
        //       info: "Historical evolution of the settlement"
        //     },
        //     {
        //       label: "Continent",
        //       name: "siteOriginGeolocation",
        //       type: "radio",
        //       value: getFormValue(["site", "origin", "geolocation"]),
        //       options: ['Africa', 'Europe', 'North America', 'South America', 'Asia', 'Oceania', 'Antarctica']
        //     },
        //     {
        //       label: "Population",
        //       name: "siteOriginPopulation",
        //       value: getFormValue(["site", "origin", "population"]),
        //       type: "text",
        //     },
        //     {
        //       label: "Topography",
        //       name: "siteGeographyTopography",
        //       type: "radio",
        //       value: getFormValue(["site", "geography", "topography"]),
        //       options: ["By the coast", "Desert", "Valley", "Mountain", "Forest", "Water"],
        //       info: "Geographical features of the location of the Settlement "
        //     },
        //     {
        //       label: "Within cities",
        //       name: "siteGeographyWithinCities",
        //       type: "radio",
        //       value: getFormValue(["site", "geography", "withinCities"]),
        //       options: ["Squatting on the fringe", "In the path of development", "In the heart of the city", "Along railway tracks", "Residential centers", "Suburban industrial areas", "Old city slum"],
        //       info: "Relationship between the settlement geolocation and the city of reference"
        //     },
        //     {
        //       label: "Climate",
        //       name: "siteGeographyClimate",
        //       type: "radio",
        //       value: getFormValue(["site", "geography", "climate"]),
        //       options: ["Tropical (Type A)", "Arid (Type B)", "Temperate (Type C)", "Continental (Type D)", "Polar (Type E)"]
        //     },
        //     {
        //       label: "Security",
        //       name: "siteVulnerabilitySecurityCrimeRate",
        //       type: "range",
        //       value: getFormValue(["site", "vulnerability", "security", "crimeRate"]),
        //       options: ["Low crime rate", "Moderate crime rate", "High crime rate"],
        //       info: "Level of crime and insecurity in the Settlement"
        //     },
        //   ],

        //   // Architecture
        //   [
        //     {
        //       label: "House quality",
        //       name: "architecturePhysicalNatureHouseQuality",
        //       type: "radio",
        //       value: getFormValue(["architecture", "physicalNature", "houseQuality"]),
        //       options: ["Inadequate", "Suitable", "Optimal"]
        //     },
        //     {
        //       label: "Materials from which the house in the Settlement is made with",
        //       name: "architecturePhysicalNatureMaterials",
        //       type: "checkbox",
        //       value: getFormValue(["architecture", "physicalNature", "materials"]),
        //       options: ["Mud", "Brick", "Wood", "Concrete", "Corrugated sheet", "Tarpaulin", "Tiles", "Other"],
        //     },
        //     {
        //       label: "Development State",
        //       name: "architecturePhysicalNatureDevelopmentState",
        //       type: "radio",
        //       value: getFormValue(["architecture", "physicalNature", "developmentState"]),
        //       options: ["Initial occupancy", "Transitional", "Establish"],
        //       info: "Stage of the evolution process where the Settlement is into"
        //     },
        //     {
        //       label: "Access to Energy",
        //       name: "architectureInfrastructureAccessEnergy",
        //       type: "radio",
        //       value: getFormValue(["architecture", "infrastructure", "accessToEnergy"]),
        //       options: ["0-10%", "10-25%", "25-50%", ">50%"],
        //       info: "Percentage of dwellings that have access to power/electricity in the Settlement"
        //     },
        //     {
        //       label: "Access to Water",
        //       name: "architectureInfrastructureAccessWater",
        //       type: "radio",
        //       value: getFormValue(["architecture", "infrastructure", "accessToWater"]),
        //       options: ["0-10%", "10-25%", "25-50%", ">50%"],
        //       info: "Percentage of dwellings that have access to drinking water in the Settlement"
        //     },
        //     {
        //       label: "Access to Sanitation",
        //       name: "architectureInfrastructureAccessSanitation",
        //       type: "radio",
        //       value: getFormValue(["architecture", "infrastructure", "accessToSanitation"]),
        //       options: ["0-10%", "10-25%", "25-50%", ">50%"],
        //       info: "Percentage of dwellings that have access to sanitation in the Settlement"
        //     },
        //     {
        //       label: "Access to Internet or Phone Fare",
        //       name: "architectureInfrastructureAccessInternet",
        //       type: "radio",
        //       value: getFormValue(["architecture", "infrastructure", "accessToInternetOrPhoneFare"]),
        //       options: ["0-10%", "10-25%", "25-50%", ">50%"],
        //       info: "Percentage of people that has access to data-plans or phone fare"
        //     },
        //     {
        //       label: "Mobility systems",
        //       name: "architectureMobility",
        //       type: "checkbox",
        //       value: getFormValue(["architecture", "infrastructure", "mobilitySystems"]),
        //       options: ["Walk", "Bike", "Car", "Public transportation"],
        //       info: "Mobility systems used by the people in the Settlement"
        //     },
        //     {
        //       label: "Average number of floors in the buildings",
        //       name: "architectureDensityElevation",
        //       type: "radio",
        //       value: getFormValue(["architecture", "density", "averageFloors"]),
        //       options: ["1", "2", "3", ">3"]
        //     },
        //     {
        //       label: " Number of people living in a house",
        //       name: "architectureDensityHouseholdPerHouseSize",
        //       value: getFormValue(["architecture", "density", "householdPerHouseSize"]),
        //       type: "text"
        //     },
        //   ],

        //   // Population
        //   [
        //     {
        //       label: "Health Care: Percentage of people that has access to health care",
        //       name: "populaceHealthCare",
        //       type: "radio",
        //       options: ["0-10%", "10-25%", "25-50%", ">50%"],
        //       value: getFormValue(["populace", "accessToHealthCare"]),
        //     },
        //     {
        //       label: "Number of hospitals, clinics or health cares in the Settlement",
        //       name: "populaceHospitals",
        //       type: "text",
        //       value: getFormValue(["populace", "numberHospitals"]),
        //     },
        //     {
        //       label: "Education: Percentage of people that has access to schools/ Percentage of people attending to schools",
        //       name: "populaceEducation",
        //       type: "radio",
        //       options: ["0-10%", "10-25%", "25-50%", ">50%"],
        //       value: getFormValue(["populace", "accessToEducation"]),
        //     },
        //     {
        //       label: "Number of schools in the settlement",
        //       name: "populaceSchools",
        //       type: "text",
        //       value: getFormValue(["populace", "numberSchools"]),
        //     },
        //     {
        //       label: "Proximity to public areas or leisure activities",
        //       name: "populacePublicAreas",
        //       type: "radio",
        //       options: ["5 min walking distance", "5-20 min walking distance", ">20 min walking distance", "I need to take a car/public transportation"],
        //       value: getFormValue(["populace", "publicAreas"]),
        //     },
        //     {
        //       label: "Unemployment rate",
        //       name: "populaceUnemploymentRate",
        //       type: "text",
        //       value: getFormValue(["populace", "unemploymentRate"]),
        //     },
        //     {
        //       label: "Ownership: Level of rights that the householder has on possessing the land at the Settlement",
        //       name: "populaceOwnership",
        //       type: "radio",
        //       options: ["Community/city property", "Private house", "Illegal"],
        //       value: getFormValue(["populace", "ownershipRights"]),
        //     },
        //     // {
        //     //   label: "Ethnic and racial categories in the Settlement",
        //     //   name: "populaceEthnic",
        //     //   type: "text",
        //     // },
        //     // {
        //     //   label: "Demography: Percentage of people in each age groups in the Settlement",
        //     //   name: "populaceDemography",
        //     //   type: "text",
        //     // },
        //   ]
        // ];

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
  res.render("about");
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

app.listen(PORT);
console.log("Running on http://127.0.0.1:" + PORT);
module.exports = app;
