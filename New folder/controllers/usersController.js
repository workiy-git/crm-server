const config = require("../config/config.js");
const { ObjectId } = require("mongodb"); // Assuming MongoDB for _id handling

// Adjusted to get the users collection from the database
const getCollection = (req) => {
  return req.db.collection(config.usersCollectionName);
};

// Function to get all user data
const getAllUserData = async (req, res) => {
  console.log("Get all user data");
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

// Function to create new user data
const createUserData = async (req, res) => {
  try {
    const collection = await getCollection(req);
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

const getUsersByUsername = async (req, res) => {
  try {
    const collection = await getCollection(req);
    const usernameValue = String(req.params.username);
    const data = await collection.findOne({
      username: usernameValue,
    });
    if (data) {
      res.status(200).json({
        status: "success",
        data: data,
      });
    } else {
      res.status(404).json({
        status: "not found",
        message: "User not found with the given username",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

const updateUserData = async (req, res) => {
  try {
    const collection = await getCollection(req);
    const usernameValue = String(req.params.username);
    const updateResult = await collection.updateOne(
      { username: usernameValue },
      { $set: req.body }
    );
    if (updateResult.matchedCount === 0) {
      res.status(404).json({
        status: "not found",
        message: "User not found with the given username",
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "User data updated successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

// Export the functions to be used in routes
module.exports = {
  getAllUserData,
  createUserData,
  getUsersByUsername,
  updateUserData,
};
