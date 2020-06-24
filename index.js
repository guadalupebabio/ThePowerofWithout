require('dotenv').config();

let express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Settlement = require("./app/db/models/Settlement");

let app = express(),
    router = express.Router();

const PORT = process.env.PORT || 3000,
      DB_URL = `mongodb+srv://${process.env.MONGODB_USERNAME}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@cluster0-d6pne.mongodb.net/the_power_of_without?retryWrites=true&w=majority`;

// ** SETUP **

app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', './views');
app.set('view engine', 'pug');

// ** CONNECT TO DB **
mongoose.connect(DB_URL, function(err, res) {
  if(err) console.log("ERROR connecting to database");
  else console.log("SUCCESSfully connected to database");
});

// ** ROUTES **
app.get("/", function(req, res){
  res.render("index");
});

app.get("/contribute", function(req, res){
  res.render("form");
});

app.get("/toolkit", function(req, res){
  res.render("toolkit");
});

app.get("/about", function(req, res){
  res.render("about");
});

app.get("/map", function(req, res){
  Settlement.find({}, function(err, settlements){
    if(err) throw err;

    let countries = {}; // Aggregate settlements by country

    settlements.forEach(function(settlement){
      if (!(settlement.country in countries)) countries[settlement.country] = [];
      countries[settlement.country].push(settlement);
    });

    res.render("map", {"settlements": settlements, "countries": countries});
  });
});

app.use("/api", require("./app/routes/api.js"));

// ** START THE SERVER **

app.listen(PORT);
console.log("Running on http://127.0.0.1:" + PORT);
module.exports = app;
