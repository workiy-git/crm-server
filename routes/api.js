const express = require("express");
const router = express.Router();
const dataController = require("../controllers/dataController");
router.get("/logindata", dataController.getloginData);

module.exports = router;
