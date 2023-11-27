const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", true);
const connectDB = mongoose.connect(process.env.DATABASE_URL);

module.exports = connectDB;
