import express from "express";
import {
  getAllPagesData,
  createPagesData,
  getPagesData,
  updatePagesData,
  deletePagesData,
  getPagesByTitle
} from "../controllers/pagesController.js";

const router = express.Router();

// Route to get all pages data
router.get("/", getAllPagesData);

// Route to create new pages data
router.post("/", createPagesData);

// Route to get a single pages data by ID
router.get("/:id", getPagesData);

// Route to get a single page data by title
router.get("/:title", getPagesByTitle);

// Route to update a pages data by ID
router.put("/:id", updatePagesData);

// Route to delete a pages data by ID
router.delete("/:id", deletePagesData);

export default router;
