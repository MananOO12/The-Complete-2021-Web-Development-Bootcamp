//jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + "/date.js");
const _ = require("lodash");
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const url = "mongodb+srv://" + process.env.user + ":" + process.env.pass + "@cluster0-aws.7zkvg.mongodb.net/todolistDB?retryWrites=true&w=majority";
// console.log(url);

//MongoDB Atlas
mongoose.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true });

//todo item schema
const itemsSchema = new mongoose.Schema({
  name: String
});

//todo item Model
const Item = mongoose.model("Item", itemsSchema);

//default items
const item1 = new Item({
  name: "Welcome to your TODO List!"
});

const item2 = new Item({
  name: "Click the + button to add new item."
});

const item3 = new Item({
  name: "Click the checkbox to delete the item."
});

//deafult items array
const defaultItems = [item1, item2, item3];

//custom list schema
const listSchema = {
  name: String,
  items: [itemsSchema]
};

//custom list model
const List = mongoose.model("List", listSchema);


//GET Routes
app.get("/", function(req, res){

  // console.log(day);
  Item.find({},function(err, foundItems){
    // if list is empty add default
    if(foundItems.length == 0){

      // add default items to collection
      Item.insertMany(defaultItems, function (err){
        if(err){
          console.log(err);
        }else{
          console.log("Successfully saved to DB");
        }
      });
      // after adding default items redirect
      res.redirect("/");
    }else{
      res.render("index",{
        kindofday: "Today",
        newItems: foundItems
      });
    }
  });
});

//customlist get route
app.get("/:customList",function(req, res){
  const customList = _.capitalize(req.params.customList);

  List.findOne({name:customList}, function(err, foundList){
    if(!err){
      if(!foundList){
        //create a new list
        const list = new List({
          name: customList,
          items: defaultItems
        });

        list.save();
        res.redirect('/'+ customList);
      }else{
        //show an existing list
        res.render("index", {
          kindofday: foundList.name,
          newItems: foundList.items
        });
      }
    }
  });
});


//POST Routes
app.post("/",function(req,res){

    let item = req.body.new;
    const listName = req.body.button;

    //create obejct for new item
    const newItem = new Item({
      name: item
    });

    if(listName == "Today"){

      //add item to db
      newItem.save();
      // after adding item redirect
      res.redirect("/");
    }else{
      List.findOne({name: listName}, function(err, foundList){
        foundList.items.push(newItem);
        foundList.save();
        res.redirect("/" + listName);
      });
    }
});

app.post('/delete',function(req, res){
  let deleteItemId = req.body.check;
  let listName = req.body.listName;


  if(listName == "Today"){
    Item.findByIdAndRemove(deleteItemId,function(err){
      if(!err){
        console.log('Success! delete');
        res.redirect("/");
      }
    });
  }else{
    //deleting an element inside an array in a document
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: deleteItemId}}}, function(err){
      if(!err){
        res.redirect("/" + listName);
      }
    });
  }
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, function(){
  console.log('Server Started Successfully!');
});


// order of execution for newitem
// 1st if any post request then come to post and
// then redirect to get() method
// and from there send back
