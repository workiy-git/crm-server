const { ObjectId } = require("mongodb"); // Import ObjectId
const { handleDuplicateLead } = require('./duplicateController');
const config = require("../config/config.js");
const { addUserData } = require("./createLibrary.js");

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
const getAppDataBasedOnFilter = async (req, res) => {
  console.log("Fetching app data based on filter");

  if (!req.body || !Array.isArray(req.body)) {
    console.log("Invalid request body:", req.body);
    return res.status(400).json({
      status: "fail",
      message: "Invalid or missing filter criteria. Ensure it's an array of pipeline stages.",
    });
  }

  try {
    let filterCriteria = req.body;
    let countPipeline = [...filterCriteria];  // This will be used for count only
    console.log("User object in request:", JSON.stringify(req.user, null, 2));

    // Handle user-based filtering
    const isLoginRequest = filterCriteria.some(
      (stage) =>
        stage.$match &&
        stage.$match.pageName === "users" &&
        stage.$match.username
    );

    if (isLoginRequest) {
      console.log("Login request detected. Bypassing role-based filtering.");
    } else {
      const userRole = req.user?.role?.trim();
      const userName = req.user?.username?.trim();

      if (!userRole || !userName) {
        console.error("User role or name is not defined in the request.");
        return res.status(400).json({
          status: "fail",
          message: "User role or name is not defined in the request.",
        });
      }

      console.log(`User role: ${userRole}`);
      console.log(`User name: ${userName}`);

      if (userRole === "Presales Team" || userRole === "Sales Team") {
        const normalizedUserName = userName.trim();
        console.log(`Applying role-based filter for user: ${normalizedUserName}`);

        const matchStage = {
          $match: {
            assigned_to: {
              $regex: `^\\s*${normalizedUserName}\\s*$`,
              $options: "i",
            },
          },
        };

        filterCriteria.push(matchStage);
        countPipeline.push(matchStage);  // Ensure the count pipeline also includes this match
      }
    }

    // Sorting logic
    const sortFields = req.query.sortField?.split(",").filter(Boolean) || [];
    const sortOrders = req.query.sortOrder?.split(",").filter(Boolean) || [];

    const sortStage = {};
    if (sortFields.length > 0) {
      sortFields.forEach((field, index) => {
        sortStage[field] = sortOrders[index] === "desc" ? -1 : 1;
      });
    } else {
      sortStage["created_time"] = 1;
    }

    // Pagination and count
    const pageName = req.headers.pagename;
    let page = parseInt(req.query.page) || 1;
    let pageSize = parseInt(req.query.pageSize) || 25;
    let totalCount = 0;

    const collection = await getAppDataCollection(req);

    // Calculate total count for pagination (before applying filter)
    if (pageName !== "login") {
      // Add count stage to the pipeline for pagination purposes (without filter)
      const alreadyHasCountStage = countPipeline.some((stage) => stage.$count);
      if (!alreadyHasCountStage) {
        countPipeline.push({ $count: "totalCount" });
      }

      // Run count query on the database without the filter
      const countResult = await collection.aggregate(countPipeline, { allowDiskUse: true }).toArray();
      console.log("Count result:", countResult);
      totalCount = countResult.length > 0 ? countResult[0].totalCount : 0;
      console.log(`Total count: ${totalCount}`);

      const totalPages = Math.ceil(totalCount / pageSize);
      if (totalPages === 0) {
        return res.status(200).json({
          status: "success",
          data: [],
          pagination: {
            currentPage: 1,
            pageSize,
            totalCount: 0,
            totalPages: 0,
          },
        });
      }
      if (page > totalPages && totalPages > 0) {
        return res.status(400).json({
          status: "fail",
          message: `Requested page (${page}) exceeds total pages (${totalPages}).`,
        });
      }
      
      // After counting, apply pagination: skip and limit
      filterCriteria.push(
        { $skip: (page - 1) * pageSize },
        { $limit: pageSize }
      );
    }
    filterCriteria.push({ $sort: sortStage });
    const filteredData = await collection.aggregate(filterCriteria, { allowDiskUse: true }).toArray();

    res.status(200).json({
      status: "success",
      data: filteredData,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalCount: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error.message, error.stack);
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};


const createAppData = async (req, res) => {
  console.log("Creating new app data");
  try {
    const collection = await getAppDataCollection(req);
    const newData = req.body;
    if (req.body.pageName === 'users') {
      console.log("Creating new user data");
      const userCreated = await addUserData(newData);
    };
 
    const existingData = await collection.findOne({
      mobile_phone: newData.mobile_phone,
      pageName: 'leads',
    });
 
    const currentTime = new Date();
    const historyEntry = {
      updated_at: currentTime,
      updated_by: newData.created_by || "System", // <- Corrected
      updated_by_id: newData.created_by_id || "",
      updated_by_time_zone: "UTC",
      changes: {
        re_enquired: {
          new: "Duplicate Lead",
        }
      }
    };
   
 
    if (existingData && newData.mobile_phone) {
      const updateResult = await collection.updateOne(
        { _id: existingData._id },
        {
          $set: { re_enquired: "Yes" },
          $push: {
            history: {
              $each: [historyEntry],
              $position: 0 // 👈 Inserts at beginning of array
            }
          }
        }
      );
   
      // const updateResult = await collection.updateOne(
      //   { _id: existingData._id },
      //   { $set: { "re-enquired": 'Yes' } },
      //   $push: { history: historyEntry }
      // );
    }
 
    let dataToInsert = { ...newData };
 
    // If it's an enquiry (leads) and a duplicate, mark it as Duplicate
    if (newData.pageName === 'enquiry' && existingData) {
      const currentTime = new Date();
   
      const historyEntry = {
        updated_at: currentTime,
        updated_by: newData.created_by || "System",
        updated_by_id: newData.created_by_id || "",
        updated_by_time_zone: "UTC",
        changes: {
          enquiry_status: {
            new: "Duplicate Lead",
          }
        }
      };
   
      // Add enquiry_status and history to the new data before insert
      dataToInsert.enquiry_status = 'Duplicate';
      dataToInsert.history = [historyEntry]; // Add history array with 1 entry
    }
 
    // Insert the new data
    const insertResult = await collection.insertOne(dataToInsert);
 
    if (insertResult.acknowledged === true) {
      console.log("New data inserted successfully:", insertResult);
 
      // Check if pageName is "enquiry"
      if (newData) {
        await handleDuplicateLead(collection, newData, insertResult.insertedId);
      }
      res.status(201).json({
        status: "success",
        data: newData,
      });
    } else {
      console.log("Failed to acknowledge new data insertion:", insertResult);
      res.status(500).json({
        status: "failure",
        message: "Failed to create new app data",
      });
    }
  } catch (error) {
    console.log("Error occurred while creating new app data:", error);
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
      updated_by: req.user.first_name || "", // Check if user ID is available, otherwise use empty string
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

const updateSiteVisitsByKey = async (req, res) => {
  console.log(`Updating Sitevisits for app data with key: ${req.params.key}`);
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

    // Extract sitevisits entry from the request body
    const sitevisitsData = req.body.sitevisits;
    if (!sitevisitsData || !sitevisitsData.sitevisits) {
      return res.status(400).json({ message: "No sitevisits provided" });
    }

    const sitevisitsEntry = {
      updated_at: new Date(),
      updated_by: sitevisitsData.updated_by || "", // Check if user ID is available, otherwise use empty string
      updated_by_id: sitevisitsData.updated_by_id || "", // Check if user ID is available, otherwise use empty string
      sitevisits: sitevisitsData.sitevisits,
    };

    const updateOperations = {
      $push: { sitevisits: { $each: [sitevisitsEntry], $position: 0 } }, // Append on top
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
        data: sitevisitsEntry,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

const retrieveSiteVisitsByKey = async (req, res) => {
  console.log(`Retrieving sitevisits for app data with key: ${req.params.key}`);
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

    // Extract sitevisits from the document
    const sitevisits = document.sitevisits || [];

    res.status(200).json({
      status: "success",
      data: sitevisits,
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
  updateSiteVisitsByKey,
  retrieveSiteVisitsByKey,
};