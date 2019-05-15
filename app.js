const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

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
    dayEJS: day
  });
})

app.post("/", function(req, res) {
  console.log(req.body.newItem);
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is starting.")
})
