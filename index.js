let express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

let app = express(),
    router = express.Router();
const PORT = process.env.PORT || 3000,
      DB_URL = process.env.MONGODB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/the_power_of_without';

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

app.get("/form", function(req, res){
  res.render("form");
});


app.get("/test", function(req, res){
  res.render("test", {title: ''});
});

app.use("/api", require("./app/routes/api.js"));

// ** START THE SERVER **

app.listen(PORT);
console.log("Running on http://127.0.0.1:" + PORT);
module.exports = app;
