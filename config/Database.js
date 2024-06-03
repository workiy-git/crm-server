const mongoose = require('mongoose');

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://raguworkiy:Ragu%401978@cluster0.qipjc4f.mongodb.net/crm?retryWrites=true&w=majority";


const connectToDatabase = async () => {
  try {
    await mongoose.connect(uri); 
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }
};


module.exports = connectToDatabase;

