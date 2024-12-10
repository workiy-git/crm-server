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
router.use("/webforms", authorizeRole(["Super Admin", "Admin", "Team Lead", "Presales Team","Sales Team", "CP", "ACP"]), webformsRouter);
router.use("/users", authorizeRole(["Super Admin", "Admin", "Team Lead", "Presales Team","Sales Team", "CP", "ACP"]), userRouter);
router.use("/appdata", authorizeRole(["Super Admin", "Admin", "Team Lead", "Presales Team","Sales Team", "CP", "ACP"]), appdataRouter);
router.use("/channelpartner", authorizeRole(["Super Admin", "Admin", "Team Lead", "Presales Team","Sales Team", "CP", "ACP"]), channelpartnerRouter);
router.use("/dashboards", authorizeRole(["Super Admin", "Admin", "Team Lead", "Presales Team","Sales Team", "CP", "ACP"]), dashboardRouter); // Example: Only Admins can access dashboards
router.use("/controls", authorizeRole(["Super Admin", "Admin", "Team Lead", "Presales Team","Sales Team", "CP", "ACP"]), controlsRouter); // Example: Only Super_Admins can access controls

module.exports = router;