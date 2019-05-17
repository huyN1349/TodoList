const express = require("express");
const bodyParser = require("body-parser");
//const request = require("request");
//const ejsLint = require("ejs-lint");

//ejsLint("list");
var items = ["Buy Food", "Cook Food", "Eat Food"];
var workItems = [];

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));
app.set("view engine", "ejs");

//------Index Page-----//
app.get("/", function(req, res) {
  var today = new Date();
  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  }
  var day = today.toLocaleDateString("en-us", options)

  res.render("list", {
    listTitleEJS: day,
    itemsEJS: items,
  });
})

app.post("/", function(req, res) {
  if (req.body.list === "Work") {
    workItems.push(req.body.newItem);
    res.redirect("/work");
  } else {
    items.push(req.body.newItem);
    res.redirect("/");
  }

  //console.log(req.body);

})

//------Work Page------//
app.get("/work", function(req, res) {
  res.render("list", {
    listTitleEJS: "Work List",
    itemsEJS: workItems,
  })
})

app.post("/work", function(req, res) {
  workItems.push(req.body.newItem);
  console.log(req.body);
  res.redirect("/");
})

//-----About Page-----//
app.get("/about", function(req,res) {
  res.render("about");
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is starting.")
})
