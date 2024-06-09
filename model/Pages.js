// Pages.js

const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Function to create models dynamically without schemas
const createModel = (collectionName) => {
  // Create the model dynamically without specifying a schema
  return mongoose.model(collectionName, {}, collectionName); // Pass an empty object as schema
};

// Create the Pages model dynamically without specifying a schema
const Pages = createModel('Pages');

const getPagesData = async (req, res) => {
  try {
    const data = await Pages.find(); // Retrieve all documents from the 'Pages' collection
    if (!data || data.length === 0) {
      throw new Error('Pages data not found');
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching Pages data:', error);
    res.status(500).json({ error: 'Error fetching Pages data' });
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

router.get('/Pagesdata', getPagesData);
router.post('/savetext', saveSelectedText); // Add the route to handle saving selected text

module.exports = router;