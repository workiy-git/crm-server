const express = require("express");
const loginRouter = require("./loginRouter.js");
const menuRouter = require("./menuRouter.js");
const webformsRouter = require("./webformsRouter.js");
const pagesRouter = require("./pagesRouter.js");
const userRouter = require("./usersRouter.js");
const appdataRouter = require("./appdataRouter.js");

const router = express.Router();

router.use("/login", loginRouter);
router.use("/pages", pagesRouter);
router.use("/menus", menuRouter);
router.use("/webforms", webformsRouter);
router.use("/users", userRouter);
router.use("/appdata", appdataRouter);

module.exports = router;
