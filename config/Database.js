const mongoose = require('mongoose');

const uri = "mongodb+srv://newapiuser2:Workiy%402024@cluster0.qipjc4f.mongodb.net/crm?retryWrites=true&w=majority";


const connectToDatabase = async () => {
  try {
    await mongoose.connect(uri); 
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }
};

module.exports = connectToDatabase;
