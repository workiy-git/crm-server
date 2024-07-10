const express = require("express");
const {
  getAllDashboards,
  createDashboards,
  getDashboardsByKey,
  updateDashboardsByKey,
  deleteDashboardsByKey,
  getDashboardsBasedOnFilter,
} = require("../controllers/dashboardController.js");

const router = express.Router();

// Route to get all app data
router.get("/", getAllDashboards);

// Route to create new app data
router.post("/create", createDashboards);
router.post("/retrieve", getDashboardsBasedOnFilter);

// Route to get a single app data by key
router.get("/:key", getDashboardsByKey);

// Route to update app data by key
router.put("/:key", updateDashboardsByKey);

// Route to delete app data by key
router.delete("/:key", deleteDashboardsByKey);

module.exports = router;
