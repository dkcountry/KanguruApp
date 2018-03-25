const mongoose = require("mongoose");

//Schema Setup
const placeSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;