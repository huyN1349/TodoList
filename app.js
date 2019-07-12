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

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true
});

const itemSchema = new Schema({
  name: String,
});
const Item = mongoose.model("Item", itemSchema);
const item1 = new Item({
  name: "Welcome to your Todo List!"
});
const item2 = new Item({
  name: "Hit the + button to add a new item."
});
const item3 = new Item({
  name: "Hit this to delete an item."
});
const defaultItems = [item1, item2, item3];

const listSchema = new Schema({
  urlName: String,
  item: [itemSchema],
});
const List = mongoose.model("List", listSchema);

//Render a page
app.get(["/", "/[iI]ndex", "/[hH]ome"], function(req, res) {
  List.find({urlName: "home"}, function(err, foundList) {
    if (err) {
      console.log(err);
    } else {
      if (foundList.length === 0) {
        const list = new List({
          urlName: "home",
          item: defaultItems,
        });
        list.save();
      } else {
        //console.log(foundList[0].item);
        if (foundList[0].item.length === 0) {
          Item.insertMany(defaultItems, function(err) {
            if (err) {
              console.log(err);
            } else {
              console.log("Successfully save items");
            }
          });
          res.redirect("/");
        } else {
          res.render("list", {
            listTitleEJS: "Home Todo List",
            itemsEJS: foundList[0].item,
          });
        }
      }
    }
  })
})


app.get("/:urlName", function(req,res){
  List.find({urlName: req.params.urlName.toLowerCase()}, function(err, foundList) {
    if (err) {
      console.log(err);
    } else {
      if (foundList.length === 0) {
        const list = new List({
          urlName: req.params.urlName.toLowerCase(),
          item: defaultItems,
        });
        list.save();
      } else {
        //console.log(foundList[0].item);
        if (foundList[0].item.length === 0) {
          Item.insertMany(defaultItems, function(err) {
            if (err) {
              console.log(err);
            } else {
              console.log("Successfully save items");
            }
          });
          res.redirect("/" + req.params.urlName.toLowerCase());
        } else {
          res.render("list", {
            listTitleEJS: req.params.urlName.charAt(0).toUpperCase() + req.params.urlName.slice(1).toLowerCase() + " Todo List",
            itemsEJS: foundList[0].item,
          });
        }
      }
    }
  })
})
//   Item.find({type:req.params.urlName}, function(err,foundItems){
//     //console.log(req.params.todoType);
//     if (foundItems.length === 0){
//       const item1 = new Item({name: "Welcome to your Todo List!"});
//       const item2 = new Item({name: "Hit the + button to add a new item."});
//       const item3 = new Item({name: "Hit this to delete an item."});
//       Item.insertMany([item1,item2,item3], function(err){
//         if (err) {
//           console.log(err);
//         } else {
//           console.log("Successfully save items");
//         }
//       });
//       res.redirect("/" + req.params.urlName);
//     } else {
//       res.render("list", {
//         listTitleEJS: req.params.urlName + " Todo-List",
//         itemsEJS: foundItems,
//       });
//     }
//   });
// });

//Save a new item
app.post("/", function(req, res) {
  console.log(req.body.list.toLowerCase());
  console.log(req.body.newItem);
  List.updateOne(
    {urlName: req.body.list.toLowerCase()},
    {
      $set: {item: req.body.newItem},
      //urlName: req.body.list.toLowerCase(),

    },
    {upsert: true},
)

  if (req.body.list.toLowerCase() === "home") {
    res.redirect("/");
  } else {
    res.redirect("/" + req.body.list.toLowerCase());
  }
});

//Delete an item
app.post("/delete", function(req, res) {
  Item.findOneAndDelete({
    _id: req.body.checkbox
  }, function(err, foundItem) {
    if (err) {
      console.log(err);
    } else {
      //console.log(foundItem.type[0]);
      res.redirect("/" + foundItem.type[0]);
    }
  });
})


//-----About Page-----//
app.get("/about", function(req, res) {
  res.render("about");
})


app.listen(process.env.PORT || 3000, function() {
  console.log("Server is starting.")
})
