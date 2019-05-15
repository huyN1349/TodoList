const express = require("express");
const bodyParser = require("body-parser");
//const request = require("request");
//const ejsLint = require("ejs-lint");

//ejsLint("list");
var items = [];

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  var today = new Date();
  //var currentDay = today.getDay();
  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  }

  var day = today.toLocaleDateString("en-us", options)
  //res.sendFile(__dirname + "/index.html");
  res.render("list", {
    dayEJS: day,
    itemsEJS: items,
  });
})

app.post("/", function(req, res) {
  items.push(req.body.newItem);
  res.redirect("/");
  //console.log(req.body.newItem);
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is starting.")
})
