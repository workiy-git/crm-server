
// dataController.js

const { LoginModel } = require('../models/DataModel');

exports.getloginData = async (req, res) => {
  try {
    const data = await LoginModel.find();
    console.log('Login Data:', data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching login data:', error);
    res.status(500).json({ error: 'Error fetching login data' });
  }
};

/*
exports.gethomeData = async (req, res) => {
  try {
    const data = await HomeModel.find();
    console.log('Home Data:', data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching home data:', error);
    res.status(500).json({ error: 'Error fetching home data' });
  }
};

exports.getcourseData = async (req, res) => {
  try {
    const data = await CourseModel.find();
    console.log('course Data:', data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching course data:', error);
    res.status(500).json({ error: 'Error fetching course data' });
  }
};

exports.getaboutData = async (req, res) => {
  try {
    const data = await AboutModel.find();
    console.log('about Data:', data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching about data:', error);
    res.status(500).json({ error: 'Error fetching about data' });
  }
};

exports.getcontactData = async (req, res) => {
  try {
    const data = await ContactModel.find();
    console.log('contact Data:', data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching contact data:', error);
    res.status(500).json({ error: 'Error fetching contact data' });
  }
};

exports.getfooterData = async (req, res) => {
  try {
    const data = await FooterModel.find();
    console.log('footer Data:', data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching footer data:', error);
    res.status(500).json({ error: 'Error fetching footer data' });
  }
};

*/