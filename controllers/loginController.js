import config from "../config/config.js";

const getCollection = (req) => {
  return req.db.collection(config.loginCollectionName);
};

// Read all
export const getAllLoginData = async (req, res) => {
  console.log("Get all data");
  try {
    const collection = await getCollection(req); // replace 'collection_name' with the actual collection name
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

// Create a new login data
export const createLoginData = async (req, res) => {
  try {
    const collection = await getCollection("login");
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

// Get a single login data by ID
export const getLoginData = async (req, res) => {
  try {
    const collection = await getCollection("login");
    const data = await collection.findOne({ _id: req.params.id });
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

// Update a login data by ID
export const updateLoginData = async (req, res) => {
  try {
    const collection = await getCollection("login");
    const result = await collection.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
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

// Delete a login data by ID
export const deleteLoginData = async (req, res) => {
  try {
    const collection = await getCollection("login");
    const result = await collection.deleteOne({ _id: req.params.id });
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
