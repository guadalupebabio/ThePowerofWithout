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
      causes: String,
      geolocation: String,
      population: Number
    },
    geography: {
      topography: String,
      withinCities: String,
      climate: String,
    },
    vulnerability: {
      security: {
        crimeRate: String,
      },
    }
  },
  architecture: {
    physicalNature: {
      houseQuality: String,
      materials: [String],
      developmentState: String
    },
    infrastructure: {
      accessToEnergy: String,
      accessToWater: String,
      accessToSanitation: String,
      accessToInternetOrPhoneFare: String,
      mobilitySystems: [String],
    },
    density: {
      averageFloors: String,
      householdPerHouseSize: String,
    }
  },
  populace: {
    accessToHealthCare: String,
    accessToEducation: String,
    publicAreas: String,
    ownershipRights: String,
    numberHospitals: Number,
    numberSchools: Number,
    unemploymentRate: Number,
    // ethnicRacialCategories: String,
    // demography: String,
  }
});


module.exports = mongoose.model('Settlement', settlementSchema);
