const express = require("express");
const router = express.Router({mergeParams: true});
const Itinerary = require("../models/itinerary");
const Place = require("../models/places");
const middleware = require("../middleware");

//INDEX - show all itineraries
router.get("/", (req, res) => {
    Itinerary.find({}, (err, itineraries) => {
        if (err) {
            console.log(err);
        } else {
            res.render("itineraries/index", {itineraries: itineraries})
        }
    });
})

router.post("/", middleware.isLoggedIn, (req, res) => {
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newItinerary = {name: name, image: image, description: desc, author: author};
    
    Itinerary.create(newItinerary, (err, itinerary) => {
        if (err) {
            console.log(err);
        } else {
            console.log(itinerary._id);
            res.redirect("/itineraries/" + itinerary._id);
        }
    });
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("itineraries/new");
});

router.get("/:id", (req, res) => {
    Itinerary.findById(req.params.id.replace(/\s/g,'')).populate({path: "places", options: {sort: {'date': 1}}}).exec(function(err, foundItinerary) {
        if (err) {
            console.log(err);
        } else {
            res.render("itineraries/show", {itinerary: foundItinerary});
        }
    });
});

router.get("/:id/newplace", (req, res) => {
    Itinerary.findById(req.params.id.replace(/\s/g,''), (err, foundItinerary) => {
        if (err) {
            console.log(err);
        } else {
            res.render("itineraries/newPlace", {itinerary: foundItinerary});
        }
    });
});

router.post("/:id/newplace", middleware.isLoggedIn, (req, res) => {
    Itinerary.findById(req.params.id.replace(/\s/g,''), (err, itinerary) => {
        if(err){
            console.log(err);
            res.redirect("/itineraries");
        } else{
            const place = req.body.place;
            place.author = {
                id: req.user._id,
                username: req.user.username
            };
            Place.create(place, (err, place) => {
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

router.delete("/:id", (req, res) => {
    Itinerary.findByIdAndRemove(req.params.id.replace(/\s/g,''), (err) => {
        res.redirect("/itineraries");
    });
});


module.exports = router;