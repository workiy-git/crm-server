const config = require("../config/config.js");
const { ObjectId } = require("mongodb"); // Assuming MongoDB for _id handling

const getCollection = (req) => {
  return req.db.collection(config.MenuCollectionName);
};

// Recursively filters menu items based on the user's role
const filterMenuItemsByRole = (menuItem, userRole) => {
  if (typeof menuItem !== 'object' || menuItem === null) {
    return menuItem;
  }

  const filteredItem = {};
  
  // Loop through each property in the menu item
  for (const key in menuItem) {
    if (menuItem.hasOwnProperty(key)) {
      const value = menuItem[key];

      // If the property is an object with a role array, check if the user's role is allowed
      if (value && typeof value === 'object' && Array.isArray(value.role)) {
        if (value.role.includes(userRole)) {
          filteredItem[key] = value;  // Include the item if the user's role matches
        }
      } else {
        // Recursively filter nested objects
        filteredItem[key] = filterMenuItemsByRole(value, userRole);
      }
    }
  }
  
  return filteredItem;
};

const getAllMenuData = async (req, res) => {
  console.log("Fetching menu data with dynamic role-based filtering");
  try {
    const userRole = req.user.role;  // Assuming user role is in req.user
    const collection = await getCollection(req);

    // Fetch all menu data
    const data = await collection.find({}).toArray();

    // Filter menu data based on the user's role, dynamically for all fields
    const filteredData = data.map(menuItem => filterMenuItemsByRole(menuItem, userRole));

    res.status(200).json({
      status: "success",
      data: filteredData,
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
