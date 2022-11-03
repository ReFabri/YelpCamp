// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }
require("dotenv").config();

const mongoose = require("mongoose");
const cities = require("./cities");
const Campground = require("../models/campground");
const { places, descriptors } = require("./seedHelpers");
const { imagesArray } = require("./images");
const { description } = require("./description");

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";

mongoose.connect(dbUrl);

const db = mongoose.connection;

//THIS IS THE AMOUNT OF CAMPGROUNDS TO SEED.
const SEED_AMOUNT = 200;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

//authors id's gotten from the database.
const authors = [
  "635c563748aa720b9f69fd84",
  "635c566548aa720b9f69fd8b",
  "635c567d48aa720b9f69fd91",
  "635c569748aa720b9f69fd98",
];

const seedDB = async () => {
  //BE CAREFUL, THIS WILL CLEAR THE ENTIRE DATABASE BEFORE FILLING IT AGAIN.
  await Campground.deleteMany({});
  for (let i = 0; i < SEED_AMOUNT; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const imagesToAdd = () => {
      let indexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      let randomValue = 0;
      const randomArray = [];

      for (let i = 0; i <= 2; i++) {
        randomValue = Math.floor(Math.random() * indexes.length);
        randomArray.push(imagesArray[indexes[randomValue]]);
        indexes.splice(randomValue, 1);
      }
      return randomArray;
    };
    const camp = new Campground({
      author: sample(authors),
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: sample(description),
      price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: imagesToAdd(),
    });
    await camp.save();
  }
  console.log("All is Done!");
};

seedDB().then(() => {
  mongoose.connection.close();
});
