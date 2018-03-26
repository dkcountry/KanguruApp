const express = require("express");
const router = express.Router({mergeParams: true});
const Place = require("../models/places");

const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};


//INDEX - show all places
router.get("/", function(req, res) {
    Place.find({}, function(err, places) {
        if (err) {
            console.log(err);
        } else {
            res.render("places/index", {places: places});
        }
    });
})

router.post("/", isLoggedIn, function(req, res) {
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newPlace = {name: name, image: image, description: desc, author: author};
    
    Place.create(newPlace, function(err, place) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/places");
        }
    });
});

router.get("/new", isLoggedIn, function(req, res) {
    res.render("places/new");
});

router.get("/:id", function(req, res) {
    Place.findById(req.params.id.replace(/\s/g,'')).populate("comments").exec(function(err, foundPlace) {
        if (err) {
            console.log(err);
        } else {
            res.render("places/show", {place: foundPlace});
        }
    });
});

module.exports = router;