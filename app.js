const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Place = require("./models/places");

mongoose.connect("mongodb://localhost/travel_blog")
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


// Place.create({  name: "Peru", 
//                 image: "https://lonelyplanetwp.imgix.net/2018/01/Machu_Picchu-694dbac6b0e5.jpg?crop=entropy&fit=crop&h=421&sharp=10&vib=20&w=748", 
//                 description: "Incan people live here"},
//                 function(err, place) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(place);
//     }
// })

let places = [
    {name: "China", image: "http://airpano.ru/files/China-Great-Wall/images/image1.jpg"},
    {name: "Peru", image: "https://lonelyplanetwp.imgix.net/2018/01/Machu_Picchu-694dbac6b0e5.jpg?crop=entropy&fit=crop&h=421&sharp=10&vib=20&w=748"},
    {name: "Spain", image: "https://www.aifsabroad.com/images/country-page/aifsabroad-share-image-Barcelona.jpg"},
    {name: "China", image: "http://airpano.ru/files/China-Great-Wall/images/image1.jpg"},
    {name: "Peru", image: "https://lonelyplanetwp.imgix.net/2018/01/Machu_Picchu-694dbac6b0e5.jpg?crop=entropy&fit=crop&h=421&sharp=10&vib=20&w=748"},
    {name: "Spain", image: "https://www.aifsabroad.com/images/country-page/aifsabroad-share-image-Barcelona.jpg"},
    {name: "China", image: "http://airpano.ru/files/China-Great-Wall/images/image1.jpg"},
    {name: "Peru", image: "https://lonelyplanetwp.imgix.net/2018/01/Machu_Picchu-694dbac6b0e5.jpg?crop=entropy&fit=crop&h=421&sharp=10&vib=20&w=748"},
    {name: "Spain", image: "https://www.aifsabroad.com/images/country-page/aifsabroad-share-image-Barcelona.jpg"}
];

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/places", function(req, res) {
    Place.find({}, function(err, places) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {places: places});
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
    res.render("new");
});

app.get("/places/:id", function(req, res) {
    Place.findById(req.params.id.replace(/\s/g,''), function(err, foundPlace) {
        if (err) {
            console.log(err);
            console.log('erererer');
        } else {
            res.render("show", {place: foundPlace});
        }
    });
});

app.listen("3000", "localhost", function() {
    console.log("TravelBlog Server Running..")
});