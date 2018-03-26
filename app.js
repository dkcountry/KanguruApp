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

const commentRoutes = require("./routes/comments"),
      placeRoutes = require("./routes/places"),
      indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/travel_blog")
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./public'));
// seedDB();    //seed the db

//PASSPORT CONFIG
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

app.use("/", indexRoutes);
app.use("/places/:id/comments", commentRoutes);
app.use("/places", placeRoutes);

app.listen("3000", "localhost", function() {
    console.log("TravelBlog Server Running..");
});