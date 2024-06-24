const express = require("express");
const {
  getAllAppData,
  createAppData,
  getAppDataByKey,
  updateAppDataByKey,
  deleteAppDataByKey,
  getAppDataBasedOnFilter,
} = require("../controllers/appdataController.js");

const router = express.Router();

// Route to get all app data
router.get("/", getAllAppData);

// Route to create new app data
router.post("/create", createAppData);
router.post("/retrieve", getAppDataBasedOnFilter);

// Route to get a single app data by key
router.get("/:key", getAppDataByKey);

// Route to update app data by key
router.put("/:key", updateAppDataByKey);

// Route to delete app data by key
router.delete("/:key", deleteAppDataByKey);

module.exports = router;
