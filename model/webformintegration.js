const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Define the enquiry schema
const EnquirySchema = new mongoose.Schema({
  webformid: String,
  moduletype: String,
  company_name: String,
  name: String,
  mobileno: String,
  email: String,
  interestedproject: String,
  description: String,
  address: String,
  city: String,
  state: String,
  channelPartner: String,
  receivedTime: Date,
  status: String
}, { versionKey: false });

// Define the leads schema
const LeadsSchema = new mongoose.Schema({
  webformid: String,
  moduletype: String,
  company_name: String,
  name: String,
  mobileno: String,
  email: String,
  interestedproject: String,
  description: String,
  address: String,
  city: String,
  state: String,
  channelPartner: String,
  receivedTime: Date,
  status: String
}, { versionKey: false });

// Create the enquiry and leads models with the exact collection names
const Enquiry = mongoose.model('Enquiry', EnquirySchema, 'Enquiry');
const Lead = mongoose.model('Lead', LeadsSchema, 'Leads');

// Route to save user data
router.post('/webformintegration', async (req, res) => {
  const { webformid, moduletype, company_name, name, mobileno, email, interestedproject, description, address, city, state, channelPartner } = req.body;
  const receivedTime = new Date();

  const userData = {
    webformid,
    moduletype,
    company_name,
    name,
    mobileno,
    email,
    interestedproject,
    description,
    address,
    city,
    state,
    channelPartner,
    receivedTime
  };

  try {
    // Check if the enquiry already exists
    const existingEnquiry = await Enquiry.findOne({ email: userData.email });

    // If the enquiry already exists, set the status to "Duplicate"
    if (existingEnquiry) {
      userData.status = "Duplicate";
    }

    const enquiry = new Enquiry(userData);
    await enquiry.save();

    // Check if the lead already exists
    const existingLead = await Lead.findOne({ email: userData.email });

    // If the lead already exists, set the status to "Duplicate"
    if (existingLead) {
      userData.status = "Duplicate";
    }

    const lead = new Lead(userData);
    await lead.save();

    res.status(201).json({ message: 'Enquiry and lead data saved successfully', userData });
  } catch (error) {
    console.error('Error saving enquiry and lead:', error);
    res.status(500).json({ message: 'Error saving enquiry and lead data', error: error.toString() });
  }
});

module.exports = router;