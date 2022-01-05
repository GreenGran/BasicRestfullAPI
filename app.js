//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const { log } = require("console");

const app = express();
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser : true});
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

const wikiSchema = new mongoose.Schema({
    title :{
        type : String,
        required : true
    },
    contant: String
});
const Article = mongoose.model("Article",wikiSchema);
app.route("/articles")
.get(
    (req, res)=>{


        Article.find((err,found)=>{
            if(!err){
                res.send(found);
            }
            else{
                res.send(err);
            }
        });
        
    }
)
.post(
    (req, res)=>{
        console.log(); 
       console.log();  
     
       const newArticle = new Article({
         title:req.body.title,
         contant:req.body.contant
       });
       newArticle.save((err)=>{
           if(!err){
               res.send("successfully added new article");
           }else{
               console.log(err);
           }
       });
     }
)
.delete(
    (req,res)=>
    {
        Article.deleteMany((err)=>{
            if(!err){
                res.send("successfully deleted all articles");
            }
            else{
                res.send(err);
            }
        });
    }
);

app.route("/articles/:articleTitle")
.get(
    (req , res)=>{
        Article.findOne({title : req.params.articleTitle}, (err,found)=>{
            if(found){
                res.send(found);
            }else{
                res.send("error 404");
            }
        });
    }
)
.put((req, res) =>{
    Article.replaceOne(
        {title : req.params.articleTitle},
        {title : req.body.title, contant: req.body.contant},
        {overwrite:true},
        (err) =>{
            if (!err){
                res.send("article changed");
            }
            else{
                res.send(err+"  !"+req.params.articleTitle);
            }
        }
    );
}).patch((req,res)=>{

    Article.updateOne(
        
            {title : req.params.articleTitle},
            {$set : req.body},
            (err) =>{
                if (!err){
                    res.send("article changed");
                }
                else{
                    res.send(err+"  !"+req.params.articleTitle);
                }
            }
        
    );
}).delete(
    (req,res)=>
    {
        Article.deleteOne(
            {title :  req.params.articleTitle},
            (err)=>{
            if(!err){
                res.send("successfully deleted article");
            }
            else{
                res.send(err);
            }
        });
    }
);;

const newArticle = new Article({
    title : "test",
    contant : "please work"
});
// newArticle.save((err)=>{
//     if (err) return handleError(err);
//     else {
//       console.log("data saved!");
//     }
// });

app.use(express.static("public"));

// app.get("/articles",);
// app.post("/articles",);
// app.delete("/articles",);

app.get("/",(req,res)=>{
    res.render("index.ejs");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});