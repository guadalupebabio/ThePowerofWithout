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
      // weather: {
      //   climateChange: String,
      //   naturalDisasters: String
      // },
      security: {
        crimeRate: {type: String, enum: ["Low crime rate", "Moderate crime rate", "High crime rate"]},
      },
      // prevalence: {
      //   macro: String,
      //   urban: String,
      //   plan: String,
      //   reg: String,
      //   infras: String,
      //   armcon: String,
      //   govern: String
      // }
    }
  },
  // architecture: {
  //   physicalNature: {
  //     houseQuality: {
  //       inadequate: String,
  //       suitable: String,
  //       optimal: String,
  //     },
  //     materials: {
  //       tarpaulin: String,
  //       tiles: String,
  //       corrugatedSheet: String,
  //       wood: String,
  //       mud: String,
  //       brick: String,
  //       concrete: String,
  //       others: String,
  //     },
  //     developmentState: String
  //   },
  //   infrastructure: {
  //     energy: {
  //       accessToGas: {
  //         accessToGas: String,
  //         typeOfFuel: {
  //           gas: String,
  //           wood: String,
  //           coal: String,
  //         }
  //       },
  //       accessToElectricity: String
  //     },
  //     water: {
  //       accessToDrinkingWater: {
  //         individualDrinkingTap: String,
  //         accessToPublicTapOrOtherSources: String
  //       },
  //       accessToSanitation: {
  //         toiletAtHome: String,
  //         sharedToiletAccess: String
  //       },
  //       sewageSystem: {
  //         sewerConnection: String,
  //         garbageManagement: String
  //       },
  //     },
  //     connectivity: {
  //       accessToInternet: String,
  //       accessToTV: String
  //     },
  //     mobility: {
  //       road: {
  //         quality: {type: String, enum: ["Paved", "Compacted", "Not paved"]},
  //         sizeOfTheRoad: {
  //           pedestrian: String,
  //           bikeOrMoto: String,
  //           car: String
  //         },
  //         nameOfTheRoad: String,
  //         googleStreetView: Boolean
  //       },
  //       publicTransportation: {
  //         stops: String,
  //         proximityToPT: String,
  //       },
  //       amenties: {
  //         proximityToAmenities: String
  //       },
  //     },
  //   },
  //   density: {
  //     elevation: {
  //       lessThan1: String,
  //       twoToFive: String,
  //       greaterThanFive: String,
  //     },
  //     ratio: String,
  //     householdPerHouseSize: String,
  //   }
  // },
  // populace: {
  //   qualityOfLife: {
  //     dignity: {
  //       accessToFood: String,
  //       dressing: String,
  //       vandalism: String
  //     },
  //     health: {
  //       wellBeing: String,
  //       incidenceOfDiseases: String,
  //       mortality: String
  //     },
  //     emotionalState: {
  //       economicCondition: String,
  //       accessToEducation: String,
  //       accessToHealthAndSocialCare: String,
  //       recreationAndLeisure: String,
  //       houseQuality: String,
  //     }
  //   },
  //   economy: {
  //     jobs: {
  //       unEmploymentRate: String,
  //       employmentInTheFormalSector: String,
  //     },
  //     ownership: {
  //       Owned: String,
  //       Rented: String,
  //       Others: String,
  //     },
  //     cityDependant: Boolean
  //   },
  //   demography: {
  //     diversity: {
  //       gender: {
  //         female: Number,
  //         male: Number,
  //       },
  //       ageGroups: {
  //         oneToFive: Number,
  //         sixToTwelve: Number,
  //         thirteenToEighteen: Number,
  //         nineteenToThirty: Number,
  //         thirtyOneToFifty: Number,
  //         greaterThanFifty: Number,
  //       },
  //       ethnicAndRacialCategories: {
  //         americanIndianOrAlaskanNative: Number,
  //         asian: Number,
  //         blackOrAfricanAmerican: Number,
  //         hispanicOrLatino: Number,
  //         nativeHawaiianOrOtherPacificIslander: Number
  //       },
  //       income: String,
  //       exploration: String
  //     },
  //     socialClass: {
  //       caste: {
  //         obc: Number,
  //         scAndST: Number,
  //         others: Number,
  //       },
  //       upper: String,
  //       middle: String,
  //       working: String,
  //       lower: String,
  //       other: String
  //     }
  //   }
  // }
});


module.exports = mongoose.model('Settlement', settlementSchema);
