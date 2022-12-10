//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

main().catch(err => console.log(err));

async function main() {

 await mongoose.connect("mongodb://localhost:27017/todolistDB");

}

const itemsSchema = {
  name: String
}

const Item = mongoose.model(
  "Item",
  itemsSchema
)


const item1 = new Item ({
  name: "Welcome to the todoList"
});
const item2 = new Item ({
  name: "Add new item"
});
const item3 = new Item ({
  name: "Delete item"
});

const defaultItems = [item1, item2, item3];


app.get("/", function(req, res) {


  Item.find({}, function(err, foundItems){

    if(foundItems.length==0){
      
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        }else{
          console.log("Data added succesfully");
        }
      });
  res.redirect("/");      


    }else{

      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }

  }) 

  

});




app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();
  res.redirect("/");

});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
