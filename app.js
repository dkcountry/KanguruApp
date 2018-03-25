const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      User = require("./models/user"),
      Place = require("./models/places"),
      seedDB = require("./seeds"),
      Comment   = require("./models/comment");


mongoose.connect("mongodb://localhost/travel_blog")
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./public'));
seedDB();

//passport config
app.use(require("express-session")({
    secret: "dk",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.get("/", function(req, res) {
    res.render("landing");
});

//INDEX - show all places
app.get("/places", function(req, res) {
    Place.find({}, function(err, places) {
        if (err) {
            console.log(err);
        } else {
            res.render("places/index", {places: places});
        }
    });
})

app.post("/places", function(req, res) {
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let newPlace = {name: name, image: image, description: desc};
    Place.create(newPlace, function(err, place) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/places");
        }
    });
});

app.get("/places/new", function(req, res) {
    res.render("places/new");
});

app.get("/places/:id", function(req, res) {
    Place.findById(req.params.id.replace(/\s/g,'')).populate("comments").exec(function(err, foundPlace) {
        if (err) {
            console.log(err);
        } else {
            res.render("places/show", {place: foundPlace});
        }
    });
});

// ==========
// Comment Routes
app.get("/places/:id/comments/new", isLoggedIn, function(req, res){
    Place.findById(req.params.id.replace(/\s/g,''), function(err, place){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {place: place});
        }
    });
});

app.post("/places/:id/comments", isLoggedIn, function(req, res){
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
})

// AUTH ROUTES
app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
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
app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/places",
    failureRedirect: "/login"
}), function(req, res){

});

//logout
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/places");
})

app.listen("3000", "localhost", function() {
    console.log("TravelBlog Server Running..");
});