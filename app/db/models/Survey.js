
/**
 * To save data for the final survey page
 *
 */

let mongoose = require('mongoose'),
Schema = mongoose.Schema;
let surveySchema = new Schema({
    settlementID: String,
    userSession:String,
    settlementRelationship: Array,
    informalSettlementName:String,
    informalSettlementDefinition:String,
    surveyFillInDuration:String,
    surveyRelevance:String,
    generalFeedBack:String,
    originImportanceScale: Number,
    geographyImportanceScale: Number,
    vulnerabilityImportanceScale: Number,
    physicalNatureImportanceScale: Number,
    infrastructureImportanceScale: Number,
    densityImportanceScale: Number,
    qualityOfLifeImportanceScale:  Number,
    economyImportanceScale:  Number,
    demographyImportanceScale:  Number
})

module.exports = function(conn){
    return conn.model('Survey', surveySchema);
  }
  