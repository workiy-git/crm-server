// middlewares/database.js

import mongoose from "mongoose";
import config from "../config/config.js";
const dbUrl = config.dbUrl;

const connectToDatabase = async (req, res, next) => {
  console.log("connectToDatabase function called");

  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to the database successfully");
    }
    req.db = mongoose.connection;
    next();
  } catch (error) {
    console.error("Failed to connect to the database", error);
    next(error);
  }
};

export default connectToDatabase;
