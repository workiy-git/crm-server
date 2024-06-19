import express from "express";
import {
  getAllWebformintegrationData,
  createWebformintegrationData,
  getWebformintegrationData,
  updateWebformintegrationData,
  deleteWebformintegrationData,
} from "../controllers/WebformintegrationController.js";

const router = express.Router();

// Route to get all Webformintegration data
router.get("/", getAllWebformintegrationData);

// Route to create Webformintegration data
router.post("/", createWebformintegrationData);

// Route to get a single Webformintegration data by ID
router.get("/:id", getWebformintegrationData);

// Route to update Webformintegration data
router.put("/:id", updateWebformintegrationData);

// Route to delete a Webformintegration data by ID
router.delete("/:id", deleteWebformintegrationData);

export default router;
