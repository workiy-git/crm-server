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

const saveSelectedText = async (req, res) => {
  try {
    const { texts } = req.body;
    // Assuming you have a model named SelectedText to store selected texts
    const SelectedText = createModel('SelectedText');
    const selectedTexts = texts.map(text => ({ text }));
    await SelectedText.insertMany(selectedTexts);
    res.status(200).json({ message: 'Selected texts saved successfully' });
  } catch (error) {
    console.error('Error saving selected texts:', error);
    res.status(500).json({ error: 'An error occurred while saving selected texts' });
  }
};

router.get('/menudata', getMenuData);
router.post('/savetext', saveSelectedText); // Add the route to handle saving selected text

module.exports = router;
