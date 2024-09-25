const config = require("../config/config.js");

const getCollection = (req) => {
  return req.db.collection(config.pagesCollectionName);
};

// Read all
const getAllPagesData = async (req, res) => {
  console.log("Get all data");
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

// Create a new page data
const createPagesData = async (req, res) => {
  try {
    const collection = await getCollection(req);
    const newPage = req.body;
    const result = await collection.insertOne(newPage);

    if (result.insertedId) {
      res.status(201).json({
        status: "success",
        data: newPage,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to create new page",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

// Get a single page data by title
const getPagesDataByTitle = async (req, res) => {
  try {
    const collection = await getCollection(req);
    const titleValue = String(req.params.title);
    const data = await collection.findOne({ title: titleValue });

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

// Update a page data by title
const updatePagesDataByTitle = async (req, res) => {
  try {
    const collection = await getCollection(req);
    const title = req.params.title;
    const updateResult = await collection.updateOne(
      { title: title },
      { $set: req.body }
    );

    if (updateResult.matchedCount === 0) {
      res.status(404).json({
        status: "not found",
        message: "Page not found with the given title",
      });
    } else {
      res.status(200).json({
        status: "success",
        data: req.body,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

// Delete a page data by title
const deletePagesDataByTitle = async (req, res) => {
  try {
    const collection = await getCollection(req);
    const title = req.params.title;
    const deleteResult = await collection.deleteOne({ title: title });

    if (deleteResult.deletedCount === 0) {
      res.status(404).json({
        status: "not found",
        message: "Page not found with the given title",
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "Page deleted successfully",
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
  getAllPagesData,
  createPagesData,
  getPagesDataByTitle,
  updatePagesDataByTitle,
  deletePagesDataByTitle,
};
