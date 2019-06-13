const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser: true});

const itemSchema = new Schema({
  name: String,
  type: ["Work", "Home"],
});


const Item = mongoose.model("Item", itemSchema);

//Render a page
app.get("/", function(req,res){
  Item.find({type:"Default"}, function(err,foundItems){
    if (foundItems.length === 0){
      const item1 = new Item({name: "Welcome to your Todo List!", type: "Default"});
      const item2 = new Item({name: "Hit the + button to add a new item.", type: "Default"});
      const item3 = new Item({name: "Hit this to delete an item.", type: "Default"});
      Item.insertMany([item1,item2,item3], function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully save items");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitleEJS: "Default Todo-List",
        itemsEJS: foundItems,
      });
    }
  })
})

app.get("/:todoType", function(req,res){
  Item.find({type:req.params.todoType}, function(err,foundItems){
    //console.log(req.params.todoType);
    if (foundItems.length === 0){
      const item1 = new Item({name: "Welcome to your Todo List!", type: req.params.todoType});
      const item2 = new Item({name: "Hit the + button to add a new item.", type: req.params.todoType});
      const item3 = new Item({name: "Hit this to delete an item.", type: req.params.todoType});
      Item.insertMany([item1,item2,item3], function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully save items");
        }
      });
      res.redirect("/" + req.params.todoType);
    } else {
      res.render("list", {
        listTitleEJS: req.params.todoType + " Todo-List",
        itemsEJS: foundItems,
      });
    }
  });
});

//Save a new item
app.post("/", function(req, res) {
  Item.create({name:req.body.newItem, type:req.body.list}, function(err){
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully save an item.")
    }
  })
    if (req.body.list === "Default"){
      res.redirect("/");
    } else {
      res.redirect("/" + req.body.list);
    }
});

//Delete an item
app.post("/delete", function(req,res){
  Item.findOneAndDelete({_id:req.body.checkbox}, function(err, foundItem){
    if (err){
      console.log(err);
    } else {
      //console.log(foundItem.type[0]);
      res.redirect("/" + foundItem.type[0]);
    }
  });
})


//-----About Page-----//
app.get("/about", function(req,res) {
  res.render("about");
})


app.listen(process.env.PORT || 3000, function() {
  console.log("Server is starting.")
})
