let express = require("express"),
    mongoose = require("mongoose"),
    Settlement = require("../db/models/Settlement");

let router = express.Router();

// Returns a JSON array containing settlement data
router.get("/settlements", function(req, res){
  Settlement.find({}, function(err, docs){
    if(err) throw err;
    res.json(docs);
  });
});

// Add new settlement to database, takes a JSON request structured exactly the same as the Settlement schema
router.post("/settlements", function(req, res){ //TODO: add verification to request
  // let settlement = new Settlement(req.body);

  let settlement = new Settlement({
    "name": req.body.name,
    "country": req.body.country,
    "geolocation": {type: 'Point', coordinates: [parseFloat(req.body.lat), parseFloat(req.body.lon)] }
  });

  settlement.save(function (err) {
    if(err) throw err;
    res.send(200);
  });
});

module.exports = router;
