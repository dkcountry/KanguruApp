const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      flash = require("connect-flash"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      User = require("./models/user"),
      Place = require("./models/places"),
      Itinerary = require("./models/itinerary"),
      seedDB = require("./seeds"),
      methodOverride = require("method-override"),
      Comment   = require("./models/comment");

const commentRoutes = require("./routes/comments"),
      placeRoutes = require("./routes/places"),
      indexRoutes = require("./routes/index"),
      itineraryRoutes = require("./routes/itinerary"),
      userRoutes = require("./routes/user");

// mongoose.connect("mongodb://localhost/travel_blog")
// mongoose.connect("mongodb://dk:dk@ds235239.mlab.com:35239/kanguru");
mongoose.connect(process.env.DATABASEURL);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.use(express.static('./public'));
app.use(methodOverride("_method"));
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

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/", indexRoutes);
app.use("/places/:id/comments", commentRoutes);
app.use("/places", placeRoutes);
app.use("/itineraries", itineraryRoutes);
app.use("/", userRoutes);

app.listen(process.env.PORT || 3000, function() {
    console.log("TravelBlog Server Running..");
});