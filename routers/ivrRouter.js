const express = require("express");
const { createIvr } = require("../controllers/ivrController");

const router = express.Router();

// Route to create new channel partner data
router.post("/", createIvr);

// Route to read all channel partner data
// router.get("/", readAllChannelPartnerData);

module.exports = router;