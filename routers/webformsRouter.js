import express from "express";
import {
  getWebFormData,
  createWebFormData,
  getWebFormDataById,
  updateWebFormDataById,
  deleteWebFormDataById,
} from "../controllers/webFormController.js";

const router = express.Router();

// Route to get all web form data
router.get("/", getWebFormData);

// Route to create new web form data
router.post("/", createWebFormData);

// Route to get a single web form data by ID
router.get("/:pageName", getWebFormDataById);

// Route to update web form data by ID
router.put("/:id", updateWebFormDataById);

// Route to delete web form data by ID
router.delete("/:id", deleteWebFormDataById);

export default router;
