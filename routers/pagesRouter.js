import express from "express";
import {
  getAllPagesData,
  createPagesData,
  getPagesDataByTitle,
  updatePagesDataByTitle,
  deletePagesDataByTitle,
} from "../controllers/pagesController.js";

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

export default router;
