const { ObjectId } = require("mongodb"); // Import ObjectId
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

// Function to get app data based on filter criteria
const getAppDataBasedOnFilter_old = async (req, res) => {
  console.log("Fetching app data based on filter");
  // Check if req.body exists
  if (!req.body) {
    // Handle the absence of req.body
    // For example, send a 400 Bad Request response
    res.status(400).json({
      status: "fail",
      message: "No data provided in the request body.",
    });
    return; // Stop execution of the function
  }

  try {
    // Extract filter criteria from request body

    // Initialize an empty object for filterCriteria
    let filterCriteria = {};

    // Iterate over the keys of req.body
    Object.keys(req.body).forEach((key) => {
      // If the value is not undefined, add it to filterCriteria
      if (req.body[key] !== undefined) {
        filterCriteria[key] = req.body[key];
      }
    });
    // const filterCriteria = {
    //   pageName: req.body.pageName,
    //   call_status: req.body.calls_status, // Ensure this matches your database field
    // };

    // // Remove undefined filter criteria
    // Object.keys(filterCriteria).forEach(
    //   (key) => filterCriteria[key] === undefined && delete filterCriteria[key]
    // );

    console.log(filterCriteria);

    const collection = await getAppDataCollection(req);
    // Query the database with the filter criteria
    const filteredData = await collection
      .aggregate([
        { $match: filterCriteria },
        // Add any additional aggregation stages here
      ])
      .toArray();
    // Send the filtered data as response
    res.status(200).json({
      status: "success",
      data: filteredData,
    });
  } catch (error) {
    // Send error response
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

// Function to get app data based on filter criteria
const getAppDataBasedOnFilter = async (req, res) => {
  console.log("Fetching app data based on filter");
  // Check if req.body exists
  if (!req.body) {
    // Handle the absence of req.body
    // For example, send a 400 Bad Request response
    res.status(400).json({
      status: "fail",
      message: "No data provided in the request body.",
    });
    return; // Stop execution of the function
  }

  try {
    let filterCriteria = req.body;

    console.log("filterCriteria");
    console.log(filterCriteria);

    const collection = await getAppDataCollection(req);
    // Query the database with the filter criteria
    const filteredData = await collection.aggregate(filterCriteria).toArray();
    // Send the filtered data as response
    res.status(200).json({
      status: "success",
      data: filteredData,
    });
  } catch (error) {
    // Send error response
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
    const updateData = req.body;

    // Convert string key to ObjectId
    const objectId = new ObjectId(keyValue);
    const result = await collection.updateOne(
      { _id: objectId },
      { $set: updateData }
    );

    // const updateResult = await collection.updateOne(
    //   { [`appdata.${keyValue}`]: { $exists: true } },
    //   { $set: { [`appdata.${keyValue}`]: updateData } }
    // );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "No document found with the specified key" });
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
  getAppDataBasedOnFilter,
};
