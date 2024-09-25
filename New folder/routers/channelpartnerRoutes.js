const express = require("express");
const { createChannelPartnerData, readAllChannelPartnerData } = require("../controllers/channelpartnerController");

const router = express.Router();

// Route to create new channel partner data
router.post("/", createChannelPartnerData);

// Route to read all channel partner data
router.get("/", readAllChannelPartnerData);

module.exports = router;