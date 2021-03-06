const express = require("express");
const router = express.Router({mergeParams: true});
const Place = require("../models/places");
const middleware = require("../middleware");


//INDEX - show all places
router.get("/", function(req, res) {
    Place.find({}).sort({date: -1}).exec((err, places) => {
        if (err) {
            console.log(err);
        } else {
            res.render("places/index", {places: places});
        }
    });
})

router.post("/", middleware.isLoggedIn, (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let date = req.body.date;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newPlace = {name: name, image: image, description: desc, author: author};
    
    Place.create(newPlace, (err, place) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/places");
        }
    });
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("places/new");
});

router.get("/:id", function(req, res) {
    Place.findById(req.params.id.replace(/\s/g,'')).populate("comments").exec((err, foundPlace) => {
        if (err) {
            console.log(err);
        } else {
            res.render("places/show", {place: foundPlace});
        }
    });
});

//edit place route
router.get("/:id/edit", middleware.checkOwnership, (req, res) => {
        Place.findById(req.params.id.replace(/\s/g,''), (err, foundPlace) => {
            if(err){
                res.redirect("/places");
            } else {
                    res.render("places/edit", {place: foundPlace});
            }
        });
});

//update place route
router.put("/:id", middleware.checkOwnership, (req, res) => {
    Place.findByIdAndUpdate(req.params.id.replace(/\s/g,''), req.body.place, function(err, updatedPlace){
        if(err){
            res.redirect("/places");
        } else{
            res.redirect("/places/" + updatedPlace._id);
        }
    });
});

//destroy route
router.delete("/:id", middleware.checkOwnership, (req, res) => {
    Place.findByIdAndRemove(req.params.id.replace(/\s/g,''), function(err){
        res.redirect("/places");
    });
});

module.exports = router;