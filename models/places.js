const mongoose = require("mongoose");

//Schema Setup
const placeSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
        }
     ]
});

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;