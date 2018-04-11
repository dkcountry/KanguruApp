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


// let name = "first itinerary"
// let image = "https://brightcove04pmdo-a.akamaihd.net/5104226627001/5104226627001_5592940557001_5590734170001-vs.jpg?pubId=5104226627001&videoId=5590734170001"
// let desc = "test of itinerary data struct"
// let author = {}
// let newItinerary = {name: name, image: image, description: desc, author: author};

// Itinerary.create(newItinerary, function(err, itinerary) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(itinerary);
//     }
// });