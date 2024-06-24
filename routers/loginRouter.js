const express = require("express");
const {
  getAllLoginData,
  createLoginData,
  getLoginData,
  updateLoginData,
  deleteLoginData,
} = require("../controllers/loginController.js");

const router = express.Router();

// Route to get all login data
router.get("/", getAllLoginData);

// Route to create new login data
router.post("/", createLoginData);

// Route to get a single login data by ID
router.get("/:id", getLoginData);

// Route to update a login data by ID
router.put("/:id", updateLoginData);

// Route to delete a login data by ID
router.delete("/:id", deleteLoginData);

module.exports = router;
