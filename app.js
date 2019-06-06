const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];


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




// const homeItems = Item.find({},function(err, items){
//   if (err) {
//     console.log(err);
//   } else {
//     //mongoose.connection.close();
//     console.log(items);
//       return items.name;
//   }
// });
// //
const workItems = Item.find({type: "Work"},function(err, items){
  if (err) {
    console.log(err);
  } else {
    //mongoose.connection.close();
    items.forEach(function(item){
      return item.name;
    })
  }
});
//------Index Page-----//
app.get("/", function(req, res) {
  let day = date.getDate();
  Item.find({type:"Home"},function(err, homeItems){
    if (homeItems.length === 0) {
      const item1 = new Item({name: "Welcome to your Todo List!", type: "Home"});
      const item2 = new Item({name: "Hit the + button to add a new item.", type:"Home"});
      const item3 = new Item({name: "Hit this to delete an item.", type:"Home"});
      Item.insertMany([item1,item2,item3], function(err){
        if (err){
          console.log(err);
        } else{
          console.log("Successfully save items.")
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
          listTitleEJS: day,
          itemsEJS: homeItems,
        });
    };
  });
})

app.post("/", function(req, res) {
  if (req.body.list === "Work") {
    Item.create({name:req.body.newItem, type:"Work"},function(err){
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully save a Work item.")
      }
    });
    res.redirect("/work");
  } else {
    Item.create({name:req.body.newItem, type:"Home"},function(err){
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully save a Home item.")
      }
    });
    res.redirect("/");
  };
})

app.post("/delete", function(req,res){
  console.log(req.body.checkbox);
  Item.deleteOne({_id: req.body.checkbox}, function(err){
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully delete a completed Home item.")
      res.redirect("/");
    }
  })
})
//------Work Page------//
app.get("/work", function(req, res) {
  Item.find({type:"Work"},function(err,workItems){
    res.render("list", {
      listTitleEJS: "Work List",
      itemsEJS: workItems,
    });
  });
});

app.post("/work", function(req, res) {
  Item.create({name:req.body.newItem, type:"Work"},function(err){
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully save a Work item.")
    }
  });
  res.redirect("/");
})

//-----About Page-----//
app.get("/about", function(req,res) {
  res.render("about");
})


app.listen(process.env.PORT || 3000, function() {
  console.log("Server is starting.")
})
