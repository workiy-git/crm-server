// menu.js

const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Function to create models dynamically without schemas
const createModel = (collectionName) => {
  // Create the model dynamically without specifying a schema
  return mongoose.model(collectionName, {}, collectionName); // Pass an empty object as schema
};

// Create the Menu model dynamically without specifying a schema
const Menu = createModel('Menu');

const getMenuData = async (req, res) => {
  try {
    const data = await Menu.find(); // Retrieve all documents from the 'menu' collection
    if (!data || data.length === 0) {
      throw new Error('Menu data not found');
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching menu data:', error);
    res.status(500).json({ error: 'Error fetching menu data' });
  }
};

router.get('/menudata', getMenuData);



module.exports = router;



