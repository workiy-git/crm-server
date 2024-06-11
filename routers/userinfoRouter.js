import express from "express";
import {
  getAllUserinfoData,
  createUserinfoData,
  getUserinfoData,
  updateUserinfoData,
  deleteUserinfoData,
} from "../controllers/userinfoController.js";

const router = express.Router();

// Route to get all userinfo data
router.get("/", getAllUserinfoData);

// Route to create new userinfo data
router.post("/", createUserinfoData);

// Route to get a single userinfo data by ID
router.get("/:id", getUserinfoData);

// Route to update a userinfo data by ID
router.put("/:id", updateUserinfoData);

// Route to delete a userinfo data by ID
router.delete("/:id", deleteUserinfoData);

export default router;