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
      enum: ['polygon'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
    area:{ 
      type:Number
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
        communityEngagement:String,
    }
  },
  architecture: {
    physicalNature: {
      houseQuality: String,
      materials: Array,
      developmentState: String
    },
    infrastructure: {
      accessToEnergy: String,
      sourceOfEnergy:Array,
      accessToWater: Array,
      accessToSanitation: Array,
      accessToInternetOrPhoneFare: String,
      physicalStateOfStreets:String,
      mobilitySystems: Array,
    },
    density:{

      elevation:String,
      householdPerHouseSize:String,

    }

  },
  populace: {
    qualityOfLife: {
      proximity:String,
      accessToHealthCare: String,
      numberOfHealthCareFacilities:String,
      accessToEducation: String,
      unemploymentRate: Number,
      employmentInTheInformalSector:String,
      ownershipRights: String,
      ethinicIdentities:String,
      gender:String,
      ageGroups:{
        "0-5years" : Number,
        "19-30years": Number,
        "6-12years": Number,
        "31-50years" : Number,
        "13-18years": Number,
        "50+years": Number
      },

    }

  }
});














module.exports = function(conn){
  return conn.model('Settlement', settlementSchema);
}
