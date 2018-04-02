const express = require("express");
const router = express.Router({mergeParams: true});
const Place = require("../models/places");
const Comment = require("../models/comment");
const middleware = require("../middleware");


router.get("/new", middleware.isLoggedIn, function(req, res){
    Place.findById(req.params.id.replace(/\s/g,''), function(err, place){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {place: place});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    Place.findById(req.params.id.replace(/\s/g,''), function(err, place){
        if(err){
            console.log(err);
            res.redirect("/places");
        } else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    place.comments.push(comment);
                    place.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/places/" + place._id);
                }
            })
        }
    });
});

//edit comments
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id.replace(/\s/g,''), function(err, foundComment){
        if(err){
            res.redirect("back");
        } else{
            res.render("comments/edit", {
                place_id: req.params.id.replace(/\s/g,''),
                comment: foundComment
            })
        }
    })
})

//update comments
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id.replace(/\s/g,''), req.body.comment, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/places/"+ req.params.id.replace(/\s/g,''))
        }
    })
});

//destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id.replace(/\s/g,''), function(err){
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted");
            res.redirect("/places/" + req.params.id.replace(/\s/g,''))
        }
    })
})

module.exports = router;