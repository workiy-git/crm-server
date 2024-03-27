const { 
  createHeaderModel,
  createMenuModel,
  createnavigationModel,
  createsubmenuModel,
} = require('../models/DataModel');

const headerModel = createHeaderModel();
const menuModel = createMenuModel();
const navigationModel = createnavigationModel();
const submenuModel = createsubmenuModel();

exports.getHeaderData = async (req, res) => { // Changed from getheaderData
  try {
    const data = await headerModel.find(); // Changed from headerModel
    console.log('Header Data:', data);
    if (!data) {
      throw new Error('Header data not found');
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching header data:', error);
    res.status(500).json({ error: 'Error fetching header data' });
  }
};

exports.getMenuData = async (req, res) => { // Changed from getmenuData
  try {
    const data = await menuModel.find(); // Changed from menuModel
    console.log('menu Data:', data);
    if (!data) {
      throw new Error('menu data not found');
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching menu data:', error);
    res.status(500).json({ error: 'Error fetching menu data' });
  }
};

exports.getNavigationData = async (req, res) => { // Changed from getnavigationData
  try {
    const data = await navigationModel.find(); // Changed from navigationModel
    console.log('navigation Data:', data);
    if (!data) {
      throw new Error('navigation data not found');
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching navigation data:', error);
    res.status(500).json({ error: 'Error fetching navigation data' });
  }
};

exports.getSubmenuData = async (req, res) => { // Changed from getsubmenuData
  try {
    const data = await submenuModel.find(); // Changed from submenuModel
    console.log('submenu Data:', data);
    if (!data) {
      throw new Error('submenu data not found');
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching submenu data:', error);
    res.status(500).json({ error: 'Error fetching submenu data' });
  }
};

