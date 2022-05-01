//jshint esversion:6

const express= require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const encrypt = require('mongoose-encryption');
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded());
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema= new mongoose.Schema({
    email : String,
    password : String
});

const secret = "secretpassword";
userSchema.plugin(encrypt, {secret : secret , encryptedFields : ["password"]}); 

const User= new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
})

app.get("/login",function(req,res){
    res.render("login");
})

app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){
    const newUser= new User({
        email: req.body.username,
        password : req.body.password
    })
    newUser.save();
    res.render("secrets");
});

app.post("/login",function(req,res){
    User.findOne({email : req.body.username},function(err,foundUser){
        if(foundUser.password === req.body.password){
            res.render("secrets");
        }
        else res.send(err);
    })
});

app.listen(3000,function(){
    console.log("Server started on port 3000");
})