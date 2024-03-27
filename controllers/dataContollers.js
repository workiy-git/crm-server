const { 
  createHeaderModel,
  createMenuModel,
  createnavigationModel,
  createsubmenuModel,
  createWidgetModel, // Changed from createapplianceModel
} = require('../models/DataModel');

const headerModel = createHeaderModel();
const menuModel = createMenuModel();
const navigationModel = createnavigationModel();
const submenuModel = createsubmenuModel();
const widgetModel = createWidgetModel(); // Changed from applianceModel

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

// New controller functions for widget collection

exports.getWidgetData = async (req, res) => { // Changed from getApplianceData
  try {
    const data = await widgetModel.find(); // Changed from applianceModel
    console.log('Widget Data:', data);
    if (!data) {
      throw new Error('Widget data not found');
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching widget data:', error);
    res.status(500).json({ error: 'Error fetching widget data' });
  }
};

exports.addWidget = async (req, res) => { // Changed from addAppliance
  try {
    const { title, image } = req.body;

    const newWidget = new widgetModel({ // Changed from applianceModel
      title,
      image
    });

    await newWidget.save();

    res.status(201).json({ message: 'Widget added successfully' });
  } catch (error) {
    console.error('Error adding widget:', error);
    res.status(500).json({ error: 'Error adding widget' });
  }
};

exports.updateWidget = async (req, res) => { // Changed from updateAppliance
  try {
    const { id } = req.params;
    const { title, image } = req.body;

    const widget = await widgetModel.findById(id); // Changed from applianceModel

    if (!widget) {
      return res.status(404).json({ error: 'Widget not found' });
    }

    widget.title = title;
    widget.image = image;

    await widget.save();

    res.json({ message: 'Widget updated successfully' });
  } catch (error) {
    console.error('Error updating widget:', error);
    res.status(500).json({ error: 'Error updating widget' });
  }
};

exports.deleteWidget = async (req, res) => { // Changed from deleteAppliance
  try {
    const { id } = req.params;

    const widget = await widgetModel.findById(id); // Changed from applianceModel

    if (!widget) {
      return res.status(404).json({ error: 'Widget not found' });
    }

    await widget.remove();

    res.json({ message: 'Widget deleted successfully' });
  } catch (error) {
    console.error('Error deleting widget:', error);
    res.status(500).json({ error: 'Error deleting widget' });
  }
};
