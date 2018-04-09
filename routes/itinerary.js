const express = require("express");
const router = express.Router({mergeParams: true});
const Itinerary = require("../models/itinerary");
const Place = require("../models/places");
const middleware = require("../middleware");

//INDEX - show all itineraries
router.get("/", function(req, res) {
    Itinerary.find({}, function(err, itineraries) {
        if (err) {
            console.log(err);
        } else {
            res.render("itineraries/index", {itineraries: itineraries})
        }
    });
})

router.post("/", middleware.isLoggedIn, function(req, res) {
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newItinerary = {name: name, image: image, description: desc, author: author};
    
    Itinerary.create(newItinerary, function(err, itinerary) {
        if (err) {
            console.log(err);
        } else {
            console.log(itinerary._id);
            res.redirect("/itineraries/" + itinerary._id);
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("itineraries/new");
});

router.get("/:id", function(req, res) {
    Itinerary.findById(req.params.id.replace(/\s/g,'')).populate("places").exec(function(err, foundItinerary) {
        if (err) {
            console.log(err);
        } else {
            res.render("itineraries/show", {itinerary: foundItinerary});
        }
    });
});

router.get("/:id/newplace", function(req, res) {
    Itinerary.findById(req.params.id.replace(/\s/g,''), function(err, foundItinerary) {
        if (err) {
            console.log(err);
        } else {
            res.render("itineraries/newPlace", {itinerary: foundItinerary});
        }
    });
});

router.post("/:id/newplace", middleware.isLoggedIn, function(req, res){
    Itinerary.findById(req.params.id.replace(/\s/g,''), function(err, itinerary){
        if(err){
            console.log(err);
            res.redirect("/itineraries");
        } else{
            const place = req.body.place;
            place.author = {
                id: req.user._id,
                username: req.user.username
            };
            Place.create(place, function(err, place){
                if(err){
                    console.log(err);
                } else{
                    itinerary.places.push(place);
                    itinerary.save();
                    req.flash("success", "Successfully added place to itinerary");
                    res.redirect("/itineraries/" + itinerary._id);
                }
            })
        }
    });
});


module.exports = router;