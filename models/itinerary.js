const mongoose = require("mongoose");

//Schema Setup
const placeSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    created: {type: Date, default: Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    places: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Place"
        }
    ],
    comments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
        }
     ]
});

const Itinerary = mongoose.model("Itinerary", placeSchema);

module.exports = Itinerary;