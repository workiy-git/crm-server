const config = require("../config/config.js");

const getControlsCollection = (req) => {
  return req.db.collection(config.controlsCollectionName);
};

// Read all controls data
const getAllControls = async (req, res) => {
  console.log("Fetching all controls data");
  try {
    const collection = await getControlsCollection(req);
    const data = await collection.find().toArray(); // Assuming there's only one document for controls data
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

// Add a new control
const addControl = async (req, res) => {
  console.log("Adding new control");
  try {
    const collection = await getControlsCollection(req);
    const result = await collection.insertOne(req.body);
    res.status(201).json({
      status: "success",
      message: "Control added successfully",
      data: result.ops[0],
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

// Update an existing control
const updateControl = async (req, res) => {
  console.log("Updating control");
  try {
    const collection = await getControlsCollection(req);
    const result = await collection.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({
        status: "failure",
        message: "Control not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Control updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

// Delete a control
const deleteControl = async (req, res) => {
  console.log("Deleting control");
  try {
    const collection = await getControlsCollection(req);
    const result = await collection.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({
        status: "failure",
        message: "Control not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Control deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

module.exports = {
  getAllControls,
  addControl,
  updateControl,
  deleteControl,
};
