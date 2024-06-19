import config from "../config/config.js";
import { ObjectId } from "mongodb";

const getCollection = (req) => {
  return req.db.collection(config.WebformintegrationCollectionName);
};

// Read all
export const getAllWebformintegrationData = async (req, res) => {
  try {
    const collection = await getCollection(req);
    const data = await collection.find().toArray();
    res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

// Create Webformintegration data
export const createWebformintegrationData = async (req, res) => {
  try {
    const collection = await getCollection(req);
    const data = Array.isArray(req.body) ? req.body : [req.body];
    const formattedData = data.map(entry => ({
      ...entry,
      receivedTime: entry.receivedTime ? new Date(entry.receivedTime) : new Date(),
    }));
    const result = await collection.insertMany(formattedData);
    const insertedDocuments = await collection.find({ _id: { $in: result.insertedIds } }).toArray();
    res.status(201).json({
      status: "success",
      data: insertedDocuments,
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

// Get a single Webformintegration data by ID
export const getWebformintegrationData = async (req, res) => {
  try {
    const collection = await getCollection(req);
    const data = await collection.findOne({ _id: new ObjectId(req.params.id) });
    res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

export const updateWebformintegrationData = async (req, res) => {
  try {
    const collection = await getCollection(req);
    const { id } = req.params;
    const updateData = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ status: "failure", message: "Invalid ID format" });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ status: "failure", message: "Document not found" });
    }

    const updatedDocument = await collection.findOne({ _id: new ObjectId(id) });

    res.status(200).json({
      status: "success",
      data: updatedDocument,
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

// Delete a Webformintegration data by ID
export const deleteWebformintegrationData = async (req, res) => {
  try {
    const collection = await getCollection(req);
    const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};
