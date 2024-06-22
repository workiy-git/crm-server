const config = require("../config/config.js");

const getCollection = (req) => {
  return req.db.collection(config.pagesCollectionName);
};

// Read all
const getAllPagesData = async (req, res) => {
  console.log("Get all data");
  try {
    const collection = await getCollection(req);
    const data = await collection.findOne(); // Assuming there's only one document
    res.status(200).json({
      status: "success",
      data: data.pages,
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
    const newPage = req.body.page;
    const title = newPage.title;

    const updateResult = await collection.updateOne(
      {},
      { $set: { [`pages.${title}`]: newPage } }
    );

    if (updateResult.modifiedCount > 0) {
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

// Get a single pages data by title
const getPagesDataByTitle = async (req, res) => {
  try {
    const collection = await getCollection(req);
    const title = req.params.title;
    const data = await collection.findOne({
      [`pages.${title}`]: { $exists: true },
    });
    if (data) {
      res.status(200).json({
        status: "success",
        data: data.pages[title],
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
      { [`pages.${title}`]: { $exists: true } },
      { $set: { [`pages.${title}`]: req.body.page } }
    );

    if (updateResult.matchedCount === 0) {
      res.status(404).json({
        status: "not found",
        message: "Page not found with the given title",
      });
    } else {
      res.status(200).json({
        status: "success",
        data: req.body.page,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

// Delete a pages data by title
const deletePagesDataByTitle = async (req, res) => {
  try {
    const collection = await getCollection(req);
    const title = req.params.title;
    const updateResult = await collection.updateOne(
      { [`pages.${title}`]: { $exists: true } },
      { $unset: { [`pages.${title}`]: "" } }
    );

    if (updateResult.modifiedCount === 0) {
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
