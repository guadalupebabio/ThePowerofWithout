/*
  Settlement.js
  Represents the data for one informal settlement
*/

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// let settlementSchema = new Schema({
//   name: String,
//   country: String,
//   email: String,
//   geolocation: {
//     type: {
//       type: String,
//       enum: ['Point'],
//       required: true
//     },
//     coordinates: {
//       type: [Number],
//       required: true
//     }
//   },
//   site: {
//     origin: {
//       causes: String,
//       geolocation: String,
//       population: Number
//     },
//     geography: {
//       topography: String,
//       withinCities: String,
//       climate: String,
//     },
//     vulnerability: {
//       security: {
//         crimeRate: String,
//       },
//     }
//   },
//   architecture: {
//     physicalNature: {
//       houseQuality: String,
//       materials: [String],
//       developmentState: String
//     },
//     infrastructure: {
//       accessToEnergy: String,
//       accessToWater: String,
//       accessToSanitation: String,
//       accessToInternetOrPhoneFare: String,
//       mobilitySystems: [String],
//     },
//     density: {
//       averageFloors: String,
//       householdPerHouseSize: String,
//     }
//   },
//   populace: {
//     accessToHealthCare: String,
//     accessToEducation: String,
//     publicAreas: String,
//     ownershipRights: String,
//     numberHospitals: Number,
//     numberSchools: Number,
//     unemploymentRate: Number,
//     // ethnicRacialCategories: String,
//     // demography: String,
//   }
// });



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
      causes: Array,
      population: Number
    },
    geography: {
      topography: Array,
      withinCities: Array,
    },
    vulnerability: {
        resilienceToNaturalConditions: String , 
        crimeRate: String,
        perceptionOfInsecurity: String,
        prevalance:String,
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
      sourceOfEnergy:String,
      accessToWater: String,
      accessToSanitation: String,
      accessToInternetOrPhoneFare: String,
      physicalStateOfStreets:String,
      mobilitySystems: [String],
    }
  },
  populace: {
    qualityOfLife: {
      householdPerHouseSize:String,
      accessToHealthCare: String,
      accessToEducation: String,
      unemploymentRate: Number,
      employmentInTheInformalSector:String,
      ownershipRights: String,
      ageGroups:String,
      gender:String,
    }

  }
});














module.exports = function(conn){
  return conn.model('Settlement', settlementSchema);
}
