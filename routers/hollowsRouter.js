const express = require("express");
const {
  getAllControls,
  addControl,
  updateControl,
  deleteControl,
  getControlsByFilter,
} = require("../controllers/hollowController");

const router = express.Router();

// Route to get all controls data
router.get("/", getAllControls);

router.post("/retrive", getControlsByFilter);

// Route to add a new control
router.post("/", addControl);

// Route to update an existing control by ID
router.put("/:id", updateControl);

// Route to delete a control by ID
router.delete("/:id", deleteControl);

module.exports = router;
