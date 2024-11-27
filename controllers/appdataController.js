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
    const newData = req.body;

    // // Add history entry
    // newData.history = [
    //   {
    //     created_at: new Date(),
    //     created_by: req.created_by || "", // Check if value is available, otherwise use empty string
    //     created_by_id: req.created_by_id || "", // Check if value is available, otherwise use empty string
    //   },
    // ];

    const insertResult = await collection.insertOne(newData);

    if (insertResult.acknowledged === true) {
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
    // const data = await collection.findOne({
    //   [`appdata.${keyValue}`]: { $exists: true },
    // });

    // Convert string key to ObjectId
    const objectId = new ObjectId(keyValue);
    const data = await collection.findOne({ _id: objectId });

    if (data) {
      res.status(200).json({
        status: "success",
        data: data,
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

    // Fetch the original document
    const originalDoc = await collection.findOne({ _id: objectId });
    if (!originalDoc) {
      return res
        .status(404)
        .json({ message: "No document found with the specified key" });
    }

    // Determine the changed keys
    const changedKeys = Object.keys(updateData).filter(
      (key) => originalDoc[key] !== updateData[key]
    );

    // Get the user's time zone (you need to pass it from the frontend)
    const userTimeZone = req.body.timeZone || 'UTC'; // Default to UTC if not provided

    // Create history entry
    const historyEntry = {
      updated_at: new Date(),  // UTC timestamp
      updated_by: req.body.created_by || "", // Check if user ID is available, otherwise use empty string
      updated_by_id: req.body.created_by_id || "", // Check if user ID is available, otherwise use empty string
      updated_by_time_zone: userTimeZone, // Store user's time zone
      changes: changedKeys.reduce((acc, key) => {
        acc[key] = { old: originalDoc[key], new: updateData[key] };
        return acc;
      }, {}),
    };

    const result = await collection.updateOne(
      { _id: objectId },
      {
        $set: updateData,
        $push: { history: { $each: [historyEntry], $position: 0 } }, // Append on top
      }
    );

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


// // Update app data by key
// const updateAppDataCommentsByKey = async (req, res) => {
//   console.log(`Updating app data with key: ${req.params.key}`);
//   try {
//     const collection = await getAppDataCollection(req);
//     const keyValue = req.params.key;
//     const updateData = req.body;

//     // Convert string key to ObjectId
//     const objectId = new ObjectId(keyValue);

//     // Create comments entry if comments are provided
//     const commentsEntry = req.body.comments
//       ? {
//           updated_at: new Date(),
//           updated_by: req.body.created_by || "", // Check if user ID is available, otherwise use empty string
//           updated_by_id: req.body.created_by_id || "", // Check if user ID is available, otherwise use empty string
//           comments: req.body.comments,
//         }
//       : null;

//     const result = await collection.updateOne(
//       { _id: objectId },
//       {
//         $set: updateData,
//         $push: { comments: { $each: [commentsEntry], $position: 0 } }, // Append on top
//       }
//     );

//     if (result.modifiedCount === 0) {
//       return res
//         .status(404)
//         .json({ message: "No document found with the specified key" });
//     } else {
//       res.status(200).json({
//         status: "success",
//         data: updateData,
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       status: "failure",
//       message: error.message,
//     });
//   }
// };

const updateCommentsByKey = async (req, res) => {
  console.log(`Updating comments for app data with key: ${req.params.key}`);
  try {
    const collection = await getAppDataCollection(req);
    const keyValue = req.params.key;

    // Convert string key to ObjectId
    const objectId = new ObjectId(keyValue);

    // Fetch the original document
    const originalDoc = await collection.findOne({ _id: objectId });
    if (!originalDoc) {
      return res
        .status(404)
        .json({ message: "No document found with the specified key" });
    }

    // Extract comments entry from the request body
    const commentsData = req.body.comments;
    if (!commentsData || !commentsData.comments) {
      return res.status(400).json({ message: "No comments provided" });
    }

    const commentsEntry = {
      updated_at: new Date(),
      updated_by: commentsData.updated_by || "", // Check if user ID is available, otherwise use empty string
      updated_by_id: commentsData.updated_by_id || "", // Check if user ID is available, otherwise use empty string
      comments: commentsData.comments,
    };

    const updateOperations = {
      $push: { comments: { $each: [commentsEntry], $position: 0 } }, // Append on top
    };

    const result = await collection.updateOne(
      { _id: objectId },
      updateOperations
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "No document found with the specified key" });
    } else {
      res.status(200).json({
        status: "success",
        data: commentsEntry,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

const retrieveCommentsByKey = async (req, res) => {
  console.log(`Retrieving comments for app data with key: ${req.params.key}`);
  try {
    const collection = await getAppDataCollection(req);
    const keyValue = req.params.key;

    // Convert string key to ObjectId
    const objectId = new ObjectId(keyValue);

    // Fetch the document
    const document = await collection.findOne({ _id: objectId });
    if (!document) {
      return res
        .status(404)
        .json({ message: "No document found with the specified key" });
    }

    // Extract comments from the document
    const comments = document.comments || [];

    res.status(200).json({
      status: "success",
      data: comments,
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

const retrieveHistoryByKey = async (req, res) => {
  console.log(`Retrieving history for app data with key: ${req.params.key}`);
  try {
    const collection = await getAppDataCollection(req);
    const keyValue = req.params.key;

    // Convert string key to ObjectId
    const objectId = new ObjectId(keyValue);

    // Fetch the document
    const document = await collection.findOne({ _id: objectId });
    if (!document) {
      return res
        .status(404)
        .json({ message: "No document found with the specified key" });
    }

    // Extract history from the document
    const history = document.history || [];
    const formattedHistory = history.map((entry) => {
      const changes = Object.entries(entry.changes)
        .map(([key, value]) => {
          return `${key}: changed from "${value.old}" to "${value.new}"`;
        })
        .join(", ");

      return `On ${new Date(entry.updated_at).toLocaleString()}, ${
        entry.updated_by
      } (ID: ${entry.updated_by_id}) made the following changes: ${changes}.`;
    });

    res.status(200).json({
      status: "success",
      data: formattedHistory,
    });
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

    // Convert string key to ObjectId
    const objectId = new ObjectId(keyValue);
    const data = await collection.deleteOne({ _id: objectId });

    if (data.deletedCount === 0) {
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
  updateCommentsByKey,
  retrieveCommentsByKey,
  retrieveHistoryByKey,
};
