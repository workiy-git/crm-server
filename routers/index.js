const express = require("express");
const loginRouter = require("./loginRouter.js");
const menuRouter = require("./menuRouter.js");
const webformsRouter = require("./webformsRouter.js");
const pagesRouter = require("./pagesRouter.js");
const userRouter = require("./usersRouter.js");
const appdataRouter = require("./appdataRouter.js");
const channelpartnerRouter = require("./channelpartnerRoutes.js");
const dashboardRouter = require("./appDashboardsRouter.js");
const controlsRouter = require("./controlsRouter.js");
const authorizeRole = require("../middlewares/authorizeRole.js"); // Adjust the path as needed

const router = express.Router();

router.use("/login", loginRouter);
router.use("/pages", pagesRouter);
router.use("/menus", menuRouter);
router.use("/webforms", authorizeRole("Admin, Lead"), webformsRouter);
router.use("/users", authorizeRole("Admin, Lead"), userRouter);
router.use("/appdata", authorizeRole("Admin, Lead"), appdataRouter);
router.use("/channelpartner", authorizeRole("Admin"), channelpartnerRouter);
router.use("/dashboards", authorizeRole("Admin, Lead"), dashboardRouter); // Example: Only Admins can access dashboards
router.use("/controls", authorizeRole("Admin, Lead"), controlsRouter); // Example: Only Super_Admins can access controls

module.exports = router;
