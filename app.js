const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

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
    res.render("places", {places: places});
})

app.post("/places", function(req, res) {
    let name = req.body.name;
    let image = req.body.image;
    let newPlace = {name: name, image: image};
    places.push(newPlace);
    res.redirect("/places");
})

app.get("/places/new", function(req, res) {
    res.render("new.ejs");
})


app.listen("3000", "localhost", function() {
    console.log("TravelBlog Server Running..")
});