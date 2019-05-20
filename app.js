const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];


app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));
app.set("view engine", "ejs");

//------Index Page-----//
app.get("/", function(req, res) {
  let day = date.getDate();
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
  };
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
