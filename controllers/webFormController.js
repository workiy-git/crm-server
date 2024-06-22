const config = require("../config/config.js");

const getWebFormCollection = (req) => {
  return req.db.collection(config.webFormCollectionName);
};

// Read all web form data
const getWebFormData = async (req, res) => {
  console.log("Fetching all web form data");
  try {
    const collection = await getWebFormCollection(req);
    const data = await collection.find({}).toArray(); // Fetch all documents
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

// Create new web form data
const createWebFormData = async (req, res) => {
  console.log("Creating new web form data");
  try {
    const collection = await getWebFormCollection(req);
    const result = await collection.insertOne(req.body);
    res.status(201).json({
      status: "success",
      data: result.ops[0],
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

// Get web form data by ID
const getWebFormDataById = async (req, res) => {
  console.log(`Fetching web form data with ID: ${req.params.pageName}`);
  try {
    const collection = await getWebFormCollection(req);
    const data = await collection.findOne({ pageName: req.params.pageName });
    if (!data) {
      return res.status(404).json({
        status: "failure",
        message: "Data not found",
      });
    }
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

// Update web form data by ID
const updateWebFormDataById = async (req, res) => {
  console.log(`Updating web form data with ID: ${req.params.id}`);
  try {
    const collection = await getWebFormCollection(req);
    const result = await collection.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({
        status: "failure",
        message: "Data not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Data updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

// Delete web form data by ID
const deleteWebFormDataById = async (req, res) => {
  console.log(`Deleting web form data with ID: ${req.params.id}`);
  try {
    const collection = await getWebFormCollection(req);
    const result = await collection.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({
        status: "failure",
        message: "Data not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Data deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

module.exports = {
  getWebFormData,
  createWebFormData,
  getWebFormDataById,
  updateWebFormDataById,
  deleteWebFormDataById,
};
