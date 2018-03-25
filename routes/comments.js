const express = require("express");
const router = express.Router({mergeParams: true});
const Place = require("../models/places");
const Comment = require("../models/comment");

const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

router.get("/new", isLoggedIn, function(req, res){
    Place.findById(req.params.id.replace(/\s/g,''), function(err, place){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {place: place});
        }
    });
});

router.post("/", isLoggedIn, function(req, res){
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
});

module.exports = router;