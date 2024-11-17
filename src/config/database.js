
const password = "uQqM02A5LJ5lY7pD";
const URI = "mongodb+srv://sauravsingh3480:uQqM02A5LJ5lY7pD@cluster0.48a45.mongodb.net/techswipe";

const mongoose = require("mongoose");

async function connectDB() {
    await mongoose.connect(URI);
    console.log("Connect to DB successfully");
}

module.exports = connectDB;