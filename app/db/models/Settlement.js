/*
  Settlement.js
  Represents the data for one informal settlement
*/

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let settlementSchema = new Schema({
  name: String,
  country: String,
  email: String,
  geolocation: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  site: {
    origin: {
      causes: {type: String, enum: ["Squatting", "Refugee Camp", "Illegal Subdivision", "Other"]},
      geolocation: {type: String, enum: ['Africa', 'Europe', 'North America', 'South America', 'Asia', 'Oceania', 'Antarctica']},
      population: Number
    },
    geography: {
      topography: {type: String, enum: ["By the coast", "Desert", "Valley", "Mountain", "Forest", "Water"]},
      withinCities: {type: String, enum: ["Squatting on the fringe", "In the path of development", "In the heart of the city", "Along railway tracks", "Residential centers", "Suburban industrial areas", "Old city slum"]},
      climate: {type: String, enum: ["Tropical (Type A)", "Arid (Type B)", "Temperate (Type C)", "Continental (Type D)", "Polar (Type E)"]},
    },
    vulnerability: {
      security: {
        crimeRate: {type: String, enum: ["Low crime rate", "Moderate crime rate", "High crime rate"]},
      },
    }
  },
  architecture: {
    physicalNature: {
      houseQuality: {type: String, enum: ["Inadequate", "Suitable", "Optimal"]},
      materials: [String],
      developmentState: {type: String, enum: ["Initial occupancy", "Transitional", "Establish"]}
    },
    infrastructure: {
      accessToEnergy: {type: String, enum: ["0-10%", "10-25%", "25-50%", ">50%"]},
      accessToWater: {type: String, enum: ["0-10%", "10-25%", "25-50%", ">50%"]},
      accessToSanitation: {type: String, enum: ["0-10%", "10-25%", "25-50%", ">50%"]},
      accessToInternetOrPhoneFare: {type: String, enum: ["0-10%", "10-25%", "25-50%", ">50%"]},
      mobilitySystems: [String],
    },
    density: {
      averageFloors: {type: String, enum: ["1", "2", "3", ">3"]},
      householdPerHouseSize: String,
    }
  },
  populace: {
    accessToHealthCare: {type: String, enum: ["0-10%", "10-25%", "25-50%", ">50%"]},
    accessToEducation: {type: String, enum: ["0-10%", "10-25%", "25-50%", ">50%"]},
    publicAreas: {type: String, enum: ["5 min walking distance", "5-20 min walking distance", ">20 min walking distance", "I need to take a car/public transportation"]},
    ownershipRights: {type: String, enum: ["Community/city property", "Private house", "Illegal"]},
    numberHospitals: Number,
    numberSchools: Number,
    unemploymentRate: Number,
    // ethnicRacialCategories: String,
    // demography: String,
  }
});


module.exports = mongoose.model('Settlement', settlementSchema);
