const express = require("express");
const {
  getAllPagesData,
  createPagesData,
  getPagesDataByTitle,
  updatePagesDataByTitle,
  deletePagesDataByTitle,
} = require("../controllers/pagesController.js");

const router = express.Router();

// Route to get all pages data
router.get("/", getAllPagesData);

// Route to create new pages data
router.post("/", createPagesData);

// Route to get a single page data by title
router.get("/:title", getPagesDataByTitle);

// Route to update a page data by title
router.put("/:title", updatePagesDataByTitle);

// Route to delete a page data by title
router.delete("/:title", deletePagesDataByTitle);

module.exports = router;
