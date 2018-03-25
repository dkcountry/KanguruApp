const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Place = require("./models/places");
const seedDB = require("./seeds");
const Comment   = require("./models/comment");


mongoose.connect("mongodb://localhost/travel_blog")
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./public'));

seedDB();

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/places", function(req, res) {
    Place.find({}, function(err, places) {
        if (err) {
            console.log(err);
        } else {
            res.render("places/index", {places: places});
        }
    });
})

app.post("/places", function(req, res) {
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let newPlace = {name: name, image: image, description: desc};
    Place.create(newPlace, function(err, place) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/places");
        }
    });
});

app.get("/places/new", function(req, res) {
    res.render("places/new");
});

app.get("/places/:id", function(req, res) {
    Place.findById(req.params.id.replace(/\s/g,'')).populate("comments").exec(function(err, foundPlace) {
        if (err) {
            console.log(err);
        } else {
            res.render("places/show", {place: foundPlace});
        }
    });
});

// ==========
// Comment Routes

app.get("/places/:id/comments/new", function(req, res){
    Place.findById(req.params.id.replace(/\s/g,''), function(err, place){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {place: place});
        }
    });
});

app.post("/places/:id/comments", function(req, res){
    Place.findById(req.params.id.replace(/\s/g,''), function(err, place){
        if(err){
            console.log(err);
            res.redirect("/places");
        } else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else{
                    place.comments.push(comment);
                    place.save();
                    res.redirect("/places/" + place._id);
                }
            })
        }
    });
})

app.listen("3000", "localhost", function() {
    console.log("TravelBlog Server Running..")
});