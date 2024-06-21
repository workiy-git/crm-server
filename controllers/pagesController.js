import config from "../config/config.js";

const getCollection = (req) => {
  return req.db.collection(config.pagesCollectionName);
};

// Read all
export const getAllPagesData = async (req, res) => {
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

// Create a new page data
export const createPagesData = async (req, res) => {
  try {
    const collection = await getCollection("pages");
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

// Get a single pages data by ID
export const getPagesData = async (req, res) => {
  try {
    const collection = await getCollection("pages");
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

// Get pages data by title
export const getPagesByTitle = async (req, res) => {
  try {
    const collection = await getCollection("pages");
    const title = req.params.title;
    console.log(title);
    const data = await collection.findOne({ "page.title": title });
    if (data) {
      res.status(200).json({
        status: "success",
        data: data,
      });
    } else {
      res.status(404).json({
        status: "not found",
        message: "Page not found with the given title",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

// Update a page data by ID
export const updatePagesData = async (req, res) => {
  try {
    const collection = await getCollection("pages");
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

// Delete a pages data by ID
export const deletePagesData = async (req, res) => {
  try {
    const collection = await getCollection("pages");
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
