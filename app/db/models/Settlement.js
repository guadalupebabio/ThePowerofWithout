/*
  Settlement.js
  Represents the data for one informal settlement
*/

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let settlementSchema = new Schema({
  name: String,
  country: String,
  geolocation: String,
  site: {
    origin: {
      causes: String,
      geolocation: {type: String, enum: ['Africa', 'Europe', 'North America', 'South America', 'Asia', 'Oceania', 'Antarctica']},
      population: Number
    },
    geography: {
      topography: String,
      withinCities: String,
      climate: String,
    },
    vulnerability: {
      weather: {
        climateChange: String,
        naturalDisasters: String
      },
      security: {
        crimeRate: String,
      },
      prevalence: {
        macro: String,
        urban: String,
        plan: String,
        reg: String,
        infras: String,
        armcon: String,
        govern: String
      }
    }
  },
  architecture: {
    physicalNature: {
      houseQuality: {
        inadequate: String,
        suitable: String,
        optimal: String,
      },
      materials: {
        tarpaulin: String,
        tiles: String,
        corrugatedSheet: String,
        wood: String,
        mud: String,
        brick: String,
        concrete: String,
        others: String,
      },
      developmentState: String
    },
    infrastructure: {
      energy: {
        accessToGas: {
          accessToGas: String,
          typeOfFuel: {
            gas: String,
            wood: String,
            coal: String,
          }
        },
        accessToElectricity: String
      },
      water: {
        accessToDrinkingWater: {
          individualDrinkingTap: String,
          accessToPublicTapOrOtherSources: String
        },
        accessToSanitation: {
          toiletAtHome: String,
          sharedToiletAccess: String
        },
        sewageSystem: {
          sewerConnection: String,
          garbageManagement: String
        },
      },
      connectivity: {
        accessToInternet: String,
        accessToTV: String
      },
      mobility: {
        road: {
          quality: {type: String, enum: ["Paved", "Compacted", "Not paved"]},
          sizeOfTheRoad: {
            pedestrian: String,
            bikeOrMoto: String,
            car: String
          },
          nameOfTheRoad: String,
          googleStreetView: Boolean
        },
        publicTransportation: {
          stops: String,
          proximityToPT: String,
        },
        amenties: {
          proximityToAmenities: String
        },
      },
    },
    density: {
      elevation: {
        lessThan1: String,
        twoToFive: String,
        greaterThanFive: String,
      },
      ratio: String,
      householdPerHouseSize: String,
    }
  },
  populace: {
    qualityOfLife: {
      dignity: {
        accessToFood: String,
        dressing: String,
        vandalism: String
      },
      health: {
        wellBeing: String,
        incidenceOfDiseases: String,
        mortality: String
      },
      emotionalState: {
        economicCondition: String,
        accessToEducation: String,
        accessToHealthAndSocialCare: String,
        recreationAndLeisure: String,
        houseQuality: String,
      }
    },
    economy: {
      jobs: {
        unEmploymentRate: String,
        employmentInTheFormalSector: String,
      },
      ownership: {
        Owned: String,
        Rented: String,
        Others: String,
      },
      cityDependant: Boolean
    },
    demography: {
      diversity: {
        gender: {
          female: Decimal,
          male: Decimal,
        },
        ageGroups: {
          oneToFive: Decimal,
          sixToTwelve: Decimal,
          thirteenToEighteen: Decimal,
          nineteenToThirty: Decimal,
          thirtyOneToFifty: Decimal,
          greaterThanFifty: Decimal,
        },
        ethnicAndRacialCategories: {
          americanIndianOrAlaskanNative: Decimal,
          asian: Decimal,
          blackOrAfricanAmerican: Decimal,
          hispanicOrLatino: Decimal,
          nativeHawaiianOrOtherPacificIslander: Decimal
        },
        income: String,
        exploration: String
      },
      socialClass: {
        caste: {
          obc: Decimal,
          scAndST: Decimal,
          others: Decimal,
        },
        upper: String,
        middle: String,
        working: String,
        lower: String,
        other: String
      }
    }
  }
});


module.exports = mongoose.model('Settlement', settlementSchema);
