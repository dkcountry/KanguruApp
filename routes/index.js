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
            return res.render("register")
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/places");
        });
    });
});

//login
router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/places",
    failureRedirect: "/login"
}), function(req, res){});

//logout
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/places");
});

module.exports = router;