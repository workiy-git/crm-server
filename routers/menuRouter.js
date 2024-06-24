const express = require("express");
const {
  getAllMenuData,
  createMenuData,
  getMenuData,
  updateMenuDatabyID,
  deleteMenuData,
} = require("../controllers/menuController.js");

const router = express.Router();

// Route to get all Menu data
router.get("/", getAllMenuData);

// Route to create new Menu data
router.post("/", createMenuData);

// Route to get a single Menu data by ID

router.get("/:menu", getMenuData);

// Route to update a Menu data by ID
router.put("/:id", updateMenuDatabyID);

// Route to delete a Menu data by ID
router.delete("/:id", deleteMenuData);

module.exports = router;
