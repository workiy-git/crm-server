const config = require("../config/config.js");

const getAppDataCollection = (req) => {
  return req.db.collection(config.appdataCollectionName);
};

// Read all app data
const getAllAppData = async (req, res) => {
  console.log("Fetching all app data");
  try {
    const collection = await getAppDataCollection(req);
    const data = await collection.find().toArray(); // Assuming there's only one document for app data
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

// Create new app data
const createAppData = async (req, res) => {
  console.log("Creating new app data");
  try {
    const collection = await getAppDataCollection(req);
    const newData = req.body.appdata;
    const key = newData.key; // Assuming each piece of app data has a unique key

    const updateResult = await collection.updateOne(
      {},
      { $set: { [`appdata.${key}`]: newData } }
    );

    if (updateResult.modifiedCount > 0) {
      res.status(201).json({
        status: "success",
        data: newData,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to create new app data",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

// Get app data by key
const getAppDataByKey = async (req, res) => {
  console.log(`Fetching app data with key: ${req.params.key}`);
  try {
    const collection = await getAppDataCollection(req);
    const keyValue = String(req.params.key);
    const data = await collection.findOne({
      [`appdata.${keyValue}`]: { $exists: true },
    });

    if (data) {
      res.status(200).json({
        status: "success",
        data: data.appdata[keyValue],
      });
    } else {
      res.status(404).json({
        status: "not found",
        message: "App data not found with the given key",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

// Update app data by key
const updateAppDataByKey = async (req, res) => {
  console.log(`Updating app data with key: ${req.params.key}`);
  try {
    const collection = await getAppDataCollection(req);
    const keyValue = req.params.key;
    const updateData = req.body.appdata;

    const updateResult = await collection.updateOne(
      { [`appdata.${keyValue}`]: { $exists: true } },
      { $set: { [`appdata.${keyValue}`]: updateData } }
    );

    if (updateResult.matchedCount === 0) {
      res.status(404).json({
        status: "not found",
        message: "App data not found with the given key",
      });
    } else {
      res.status(200).json({
        status: "success",
        data: updateData,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

// Delete app data by key
const deleteAppDataByKey = async (req, res) => {
  console.log(`Deleting app data with key: ${req.params.key}`);
  try {
    const collection = await getAppDataCollection(req);
    const keyValue = req.params.key;

    const updateResult = await collection.updateOne(
      { [`appdata.${keyValue}`]: { $exists: true } },
      { $unset: { [`appdata.${keyValue}`]: "" } }
    );

    if (updateResult.modifiedCount === 0) {
      res.status(404).json({
        status: "not found",
        message: "App data not found with the given key",
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "App data deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

module.exports = {
  getAllAppData,
  createAppData,
  getAppDataByKey,
  updateAppDataByKey,
  deleteAppDataByKey,
};
