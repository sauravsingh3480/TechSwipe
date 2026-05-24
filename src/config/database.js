const URI = process.env.MONGO_URI;
const mongoose = require("mongoose");

async function connectDB() {
    await mongoose.connect(URI);
    console.log("Connect to DB successfully");
}

module.exports = connectDB;