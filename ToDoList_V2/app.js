//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

// var items = [];
// var workItems = [];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

//Connect to mongoDB database.
mongoose.connect('mongodb://localhost:27017/toDoListDB', {useNewUrlParser: true, useUnifiedTopology: true});

//Create new Schema
const itemSchema = new mongoose.Schema({
  name: String
});

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});

//Mongoose model
const Item = mongoose.model('Item', itemSchema);

const List = mongoose.model('List', listSchema);

//Insert default in the database
const item1 = new Item ({
  name: 'Buy protein'
});
const item2 = new Item ({
  name: 'Buy creatine'
});
const item3 = new Item ({
  name: 'Buy glutamine'
});

const defaultItems = [item1, item2, item3];

// Item.insertMany(defaultItems, (err) => {
//   err ? console.log(err) : console.log('Default items added to the DB');
// });





app.get("/", (req, res) => {

  // const today = new Date();
  //
  // var options = {
  //   weekday: 'long',
  //   day: 'numeric',
  //   month: 'long'
  // };
  //
  // var day = today.toLocaleDateString("en-US", options);

  //Finding all the element inside the collection
  Item.find((err, foundItems) => {

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        err ? console.log(err) : console.log('Default items added to the DB');
      });
      res.redirect('/');
    }

    err ? console.log(err) :
    res.render('list',{
      listTitle: "Today",
      foundItems: foundItems
    });
  });
});

app.post("/", (req,res) => {


  if (req.body.list === 'Work') {
    workItems.push(req.body.task);
    res.redirect("/work");
  } else {
    const itemName = req.body.task;

    const item = new Item ({
      name: itemName
    });
    item.save();

    res.redirect("/");
  }
});

app.post("/delete", (req,res) => {
  const checkedItemID = req.body.checkbox;

  Item.deleteOne({_id: checkedItemID}, (err) => {
    err ? console.log(err) : console.log("Successfully Deleted the Item");
  });

  res.redirect('/');
});

app.get("/:customListName", (req,res) => {
  const customListName = req.params.customListName;

  const list = new List ({
    name: customListName,
    items: defaultItems
  });
  list.save();
});

app.get("/work", (req, res) => {
  res.render('list', {
    listTitle: "Work List",
    newItem: workItems
  });
});




















app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
