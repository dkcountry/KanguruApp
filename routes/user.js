const express = require("express");
const router = express.Router({mergeParams: true});
const Place = require("../models/places");
const Itinerary = require("../models/itinerary");
const middleware = require("../middleware");
const User = require("../models/user");


router.get("/:user_id", middleware.isLoggedIn, function(req, res) {
    User.findById(req.params.user_id.replace(/\s/g,''), function(err, foundUser) {
        if(err){
            console.log(err);
        } else{
            console.log(foundUser);
            const user = foundUser;

            Itinerary.find({"author.id": user._id}, function(err, foundItineraries){
                if(err) {
                    console.log(err);
                } else {
                    const itineraries = foundItineraries;
                    console.log(itineraries);

                    Place.find({"author.id": user._id}, function(err, foundPlaces){
                        if(err) {
                            console.log(err);
                        } else {
                            const places = foundPlaces;
                            console.log(places);
                            res.render("users/show", {itineraries: itineraries, places: places})
                        }
                    });
                }
            });
        }
    });
});


module.exports = router;