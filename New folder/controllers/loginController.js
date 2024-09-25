const config = require("../config/config.js");
const { ObjectId } = require("mongodb"); // Assuming MongoDB for _id handling

const getCollection = (req) => {
  return req.db.collection(config.loginCollectionName);
};

const getAllLoginData = async (req, res) => {
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

const createLoginData = async (req, res) => {
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

const getLoginData = async (req, res) => {
  try {
    const collection = await getCollection(req);
    const data = await collection.findOne({ _id: new ObjectId(req.params.id) });
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

const updateLoginData = async (req, res) => {
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

const deleteLoginData = async (req, res) => {
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
  getAllLoginData,
  createLoginData,
  getLoginData,
  updateLoginData,
  deleteLoginData,
};
