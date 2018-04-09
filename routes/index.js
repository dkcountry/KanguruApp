const express = require("express");
const router = express.Router();
const passport = require("passport");
User = require("../models/user");

const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

router.get("/", function(req, res) {
    res.render("landing");
});


// AUTH ROUTES
router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error",err.message);
            return res.redirect("/register")
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome, " + user.username);
            res.redirect("/places");
        });
    });
});

//login
router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/itineraries",
    failureRedirect: "/login"
}), function(req, res){});

//logout
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You are logged out");
    res.redirect("/itineraries");
});

module.exports = router;