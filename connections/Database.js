const mongoose = require("mongoose");
// const url = 'mongodb://0.0.0.0:27017';
const url =
  "mongodb+srv://raguworkiy:Ragu%401978@cluster0.qipjc4f.mongodb.net/crm?retryWrites=true&w=majority";
const dbName = "CRM";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(`${url}/${dbName}`);
    console.log("Connected to database");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};

module.exports = connectToDatabase;
