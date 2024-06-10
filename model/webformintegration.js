const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Define a generic schema for dynamic fields
const dynamicSchema = new mongoose.Schema({}, { strict: false, versionKey: false });

// Create the UserInformation model with the exact collection name
const UserInformation = mongoose.model('UserInformation', dynamicSchema, 'UserInformation');

// Create: Route to save user data
router.post('/webformintegration', async (req, res) => {
  const userData = { ...req.body, receivedTime: new Date() };

  try {
    const userInfo = new UserInformation(userData);
    await userInfo.save();
    res.status(201).json({ message: 'User information saved successfully', userData: userInfo });
  } catch (error) {
    console.error('Error saving user information:', error);
    res.status(500).json({ message: 'Error saving user information', error: error.toString() });
  }
});

// Read: Route to get user data
router.get('/webformintegration/:id?', async (req, res) => {
  const { id } = req.params;
  try {
    if (id) {
      const user = await UserInformation.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User information not found' });
      }
      res.status(200).json(user);
    } else {
      const users = await UserInformation.find();
      res.status(200).json(users);
    }
  } catch (error) {
    console.error('Error fetching user information:', error);
    res.status(500).json({ message: 'Error fetching user information', error: error.toString() });
  }
});

// Update: Route to update user data by ID
router.put('/webformintegration/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const userInfo = await UserInformation.findByIdAndUpdate(id, updateData, { new: true });
    if (!userInfo) {
      return res.status(404).json({ message: 'User information not found' });
    }
    res.status(200).json({ message: 'User information updated successfully', userInfo });
  } catch (error) {
    console.error('Error updating user information:', error);
    res.status(500).json({ message: 'Error updating user information', error: error.toString() });
  }
});

// Delete: Route to delete user data by ID
router.delete('/webformintegration/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const userInfo = await UserInformation.findByIdAndDelete(id);
    if (!userInfo) {
      return res.status(404).json({ message: 'User information not found' });
    }
    res.status(200).json({ message: 'User information deleted successfully' });
  } catch (error) {
    console.error('Error deleting user information:', error);
    res.status(500).json({ message: 'Error deleting user information', error: error.toString() });
  }
});

module.exports = router;
