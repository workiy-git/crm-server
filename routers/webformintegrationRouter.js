import express from "express";
import {
  getAllWebformintegrationData,
  createWebformintegrationData,
  getWebformintegrationData,
  updateWebformintegrationData,
  deleteWebformintegrationData,
} from "../controllers/webformintegrationController.js";

const router = express.Router();

// Route to get all Webformintegration data
router.get("/", getAllWebformintegrationData);

// Route to create new Webformintegration data
router.post("/", createWebformintegrationData);

// Route to get a single Webformintegration data by ID
router.get("/:id", getWebformintegrationData);

// Route to update a Webformintegration data by ID
router.put("/:id", updateWebformintegrationData);

// Route to delete a Webformintegration data by ID
router.delete("/:id", deleteWebformintegrationData);

export default router;