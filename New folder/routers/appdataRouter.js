const express = require("express");
const {
  getAllAppData,
  createAppData,
  getAppDataByKey,
  updateAppDataByKey,
  deleteAppDataByKey,
  getAppDataBasedOnFilter,
  updateCommentsByKey,
  retrieveCommentsByKey,
  retrieveHistoryByKey,
} = require("../controllers/appdataController.js");

const router = express.Router();

// Route to get all app data
router.get("/", getAllAppData);

// Route to create new app data
router.post("/create", createAppData);
router.post("/retrieve", getAppDataBasedOnFilter);

// Route to get a single app data by key
router.get("/:key", getAppDataByKey);

// Define the route for retrieving comments
router.get("/comments/:key", retrieveCommentsByKey);

// Define the route for retrieving history
router.get("/history/:key", retrieveHistoryByKey);

// Route to update app data by key
router.put("/:key", updateAppDataByKey);

router.put("/comments/:key", updateCommentsByKey);

// Route to delete app data by key
router.delete("/:key", deleteAppDataByKey);

module.exports = router;
