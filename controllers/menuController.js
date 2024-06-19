import config from "../config/config.js";

const getCollection = (req) => {
  return req.db.collection(config.MenuCollectionName);
};

// Read all
export const getAllMenuData = async (req, res) => {
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

// Create a new Menu data
export const createMenuData = async (req, res) => {
  try {
    const collection = await getCollection("Menu");
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

// Get a single Menu data by ID
export const getMenuData = async (req, res) => {
  try {
    const collection = await getCollection("Menu");
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

// Update a Menu data by ID
export const updateMenuData = async (req, res) => {
  try {
    const collection = await getCollection("Menu");
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

// Delete a Menu data by ID
export const deleteMenuData = async (req, res) => {
  try {
    const collection = await getCollection("Menu");
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
