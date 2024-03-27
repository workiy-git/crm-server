const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataContollers');

router.get('/headerdata', dataController.getHeaderData); // Changed from getheaderData
router.get('/menudata', dataController.getMenuData); // Changed from getmenuData
router.get('/navigationdata', dataController.getNavigationData); // Changed from getnavigationData
router.get('/submenudata', dataController.getSubmenuData); // Changed from getsubmenuData
router.get('/widgetdata', dataController.getWidgetData); // Changed from getApplianceData
router.post('/widgetdata', dataController.addWidget); // Changed from addAppliance
router.put('/widgetdata/:id', dataController.updateWidget); // Changed from updateAppliance
router.delete('/widgetdata/:id', dataController.deleteWidget); // Changed from deleteAppliance

module.exports = router;
