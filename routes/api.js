// routes/api.js

const express = require('express');
const router = express.Router();
const { LoginModel, UserModel, LandingpageModel } = require('../models/DataModel');

router.get('/login', async (req, res) => {
  try {
    const data = await LoginModel.find();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.get('/landingpage', async (req, res) => {
  try {
    const data = await LandingpageModel.find();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.post('/login', async (req, res) => {
  const { companyName, userName,  password } = req.body;

  try {
    const user = await UserModel.findOne({ companyName, userName, password });

    if (user) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
