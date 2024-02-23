const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataContollers');

router.get('/logindata', dataController.getloginData);
router.get('/headerdata', dataController.getheaderData);

module.exports = router;
