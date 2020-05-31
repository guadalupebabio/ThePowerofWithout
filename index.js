let express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

let app = express(),
    router = express.Router();
const PORT = process.env.PORT || 3000;

app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', './views');
app.set('view engine', 'pug');

// ** ROUTES **
app.get("/", function(req, res){
  res.render("index");
});

// ** START THE SERVER **
app.listen(PORT);
console.log("Running on http://127.0.0.1:" + PORT);
module.exports = app;
