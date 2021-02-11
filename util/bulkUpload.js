/*
  This script automatically adds the pre-filled taxonomy spreadsheet to the database.
*/

const csv = require('csv-parser');
const fs = require('fs');
const parseDMS = require('parse-dms');
const request = require('request');

let results = [];

fs.createReadStream('taxonomy.csv')
  .pipe(csv({skipLines: 6, headers: false}))
  .on('data', (data) => results.push(data))
  .on('end', () => {
    results.forEach(function(d){
      if(d["2"].length && d["2"] != "No"){ // If we have coords
        let settlement = {
          "name": d["0"],
          "country": d["1"],
          "lat": parseDMS(d["2"]).lat,
          "lon": parseDMS(d["2"]).lon,
          "siteOriginCauses": d["3"],
          "siteOriginGeolocation": d["4"],
          "siteOriginPopulation": parseInt(d["5"].replace(/,/g, "")),
        };

        request({
          uri: 'http://127.0.0.1:3000/api/settlements',
          method: 'POST',
          json: settlement
        }, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            console.log("success");
          }
          else{
            console.log("error");
          }
        });

      }
    })
  });
