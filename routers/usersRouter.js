const express = require("express");
const {
  getAllUserData,
  createUserData,
  getUsersByUsername,
  updateUserData,
} = require("../controllers/usersController.js");

const router = express.Router();

// Route to get all user data
router.get("/", getAllUserData);

// Route to create new user data
router.post("/", createUserData);

// Route to get a single user data by username
router.get("/:username", getUsersByUsername);

// Route to update user data by username
router.put("/:username", updateUserData);

// Assuming a delete operation might be needed, even though not explicitly mentioned in UsersController.js
// Route to delete user data by username
router.delete("/:username", (req, res) => {
  // Implementation for deleting a user by username
});

module.exports = router;
