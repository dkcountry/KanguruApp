const Place = require("../models/places");
const Comment = require("../models/comment");

//all middleware goes here
const middlewareObj = [];

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be logged in first");
    res.redirect("/login");
};

middlewareObj.checkOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Place.findById(req.params.id.replace(/\s/g,''), function(err, foundPlace){
            if(err){
                req.flash("error", "Page not Found");
                res.redirect("back");
            } else {
                if(foundPlace.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash("error", "You must be logged in first");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id.replace(/\s/g,''), function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        })
    } else {
        res.redirect("back");
    }
}

module.exports = middlewareObj;