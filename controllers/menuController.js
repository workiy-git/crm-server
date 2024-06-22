const config = require("../config/config.js");
const { ObjectId } = require("mongodb"); // Assuming MongoDB for _id handling

const getCollection = (req) => {
  return req.db.collection(config.MenuCollectionName);
};

const getAllMenuData = async (req, res) => {
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

const createMenuData = async (req, res) => {
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

const getMenuData = async (req, res) => {
  try {
    const menuId = String(req.params.menu);

    const collection = await getCollection(req);
    const data = await collection.findOne({
      menu: menuId,
    });
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

const updateMenuDatabyID = async (req, res) => {
  try {
    const collection = await getCollection(req);
    const result = await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
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

const deleteMenuData = async (req, res) => {
  try {
    const collection = await getCollection(req);
    const result = await collection.deleteOne({
      _id: new ObjectId(req.params.id),
    });
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

module.exports = {
  getAllMenuData,
  createMenuData,
  getMenuData,
  updateMenuDatabyID,
  deleteMenuData,
};
