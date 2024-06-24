const express = require("express");
const { createChannelPartnerData } = require("../controllers/channelpartnerController");

const router = express.Router();

// Route to create new channel partner data
router.post("/", createChannelPartnerData);

module.exports = router;