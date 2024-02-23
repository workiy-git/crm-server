const mongoose = require('mongoose');

// Function to create models dynamically without schemas
const createModel = (collectionName) => {
  // Create the model dynamically without specifying a schema
  return mongoose.model(collectionName, {}, collectionName); // Pass an empty object as schema
};

// Create models for different collections
const createLoginModel = () => createModel('login');
const createHeaderModel = () => createModel('header');

module.exports = {
  createLoginModel,
  createHeaderModel,
  
};
