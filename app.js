//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const url = "mongodb+srv://" + process.env.user + ":" + process.env.pass + "@cluster0-aws.7zkvg.mongodb.net/blogDB?retryWrites=true&w=majority";

mongoose.connect(url ,{ useNewUrlParser: true ,useUnifiedTopology: true });

//Blog schema
const blogSchema = new mongoose.Schema({
  postTitle: String,
  post : String
});

//create collection using model()
const Blog = mongoose.model('Blog', blogSchema);

//Global variables
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


//GET methods
app.get("/",function(req,res){
  Blog.find({}, function(err, foundBlogs){
    if(!err){
      res.render("home", {
        homeStart: homeStartingContent,
        postList: foundBlogs
      });
    }
  });
});

app.get("/about",function(req,res){
    res.render("about", {aboutStart: aboutContent});
});

app.get("/contact",function(req,res){
    res.render("contact", {contactStart: aboutContent});
});

app.get("/compose",function(req,res){
    res.render("compose");
});

app.get("/posts/:postId",function(req,res){
const requestedTitle = req.params.postId;

Blog.findOne({_id: requestedTitle},function(err, foundBlog){
    if(!err){
      res.render("post", {blog:foundBlog});
    }
  });
});


//POST methods
app.post("/compose",function(req,res){
  const blog= new Blog({
    postTitle: _.capitalize(req.body.postTitle),
    post: req.body.postBody
  });

  blog.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log('Server Started Successfully!');
});
