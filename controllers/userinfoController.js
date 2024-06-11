import config from "../config/config.js";

const getCollection = (req) => {
  return req.db.collection(config.UserinfoCollectionName);
};

// Read all
export const getAllUserinfoData = async (req, res) => {
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

// Create a new Userinfo data
export const createUserinfoData = async (req, res) => {
  try {
    const collection = await getCollection("Userinfo");
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

// Get a single Userinfo data by ID
export const getUserinfoData = async (req, res) => {
  try {
    const collection = await getCollection("Userinfo");
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

// Update a Userinfo data by ID
export const updateUserinfoData = async (req, res) => {
  try {
    const collection = await getCollection("Userinfo");
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

// Delete a Userinfo data by ID
export const deleteUserinfoData = async (req, res) => {
  try {
    const collection = await getCollection("Userinfo");
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