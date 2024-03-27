const mongoose = require('mongoose');

// Function to create models dynamically without schemas
const createModel = (collectionName) => {
  // Create the model dynamically without specifying a schema
  return mongoose.model(collectionName, {}, collectionName); // Pass an empty object as schema
};

// Create models for different collections
const createHeaderModel = () => createModel('headerdata');
const createMenuModel = () => createModel('menu');
const createnavigationModel = () => createModel('navigation');
const createsubmenuModel = () => createModel('submenu');
const createWidgetModel = () => createModel('widget'); // Changed "Appliance" to "Widget"
  
module.exports = {
  createHeaderModel,
  createMenuModel,
  createnavigationModel,
  createsubmenuModel,
  createWidgetModel, // Changed "createapplianceModel" to "createWidgetModel"
};
