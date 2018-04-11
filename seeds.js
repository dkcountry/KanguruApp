const mongoose = require("mongoose");
const Place = require("./models/places");
const Comment   = require("./models/comment");
 
let data = [
    {
        name: "Peru", 
        image: "https://lonelyplanetwp.imgix.net/2018/01/Machu_Picchu-694dbac6b0e5.jpg?crop=entropy&fit=crop&h=421&sharp=10&vib=20&w=748", 
        description: "Incan people live here"
    },
    {
        name: "China", 
        image: "http://airpano.ru/files/China-Great-Wall/images/image1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Spain", 
        image: "https://www.aifsabroad.com/images/country-page/aifsabroad-share-image-Barcelona.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]
 
function seedDB(){
   //Remove all places
   Place.remove({}, (err) => {
        if(err){
            console.log(err);
        }
        console.log("removed places!");
        Comment.remove({}, (err) => {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few places
            data.forEach((seed) => {
                Place.create(seed, (err, place) => {
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a place");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, (err, comment) => {
                                if(err){
                                    console.log(err);
                                } else {
                                    place.comments.push(comment);
                                    place.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
}
 
module.exports = seedDB;