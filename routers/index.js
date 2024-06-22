const express = require("express");
const loginRouter = require("./loginRouter.js");
const menuRouter = require("./menuRouter.js");
const webformsRouter = require("./webformsRouter.js");
const pagesRouter = require("./pagesRouter.js");
const router = express.Router();

router.use("/login", loginRouter);
router.use("/pages", pagesRouter);
router.use("/menus", menuRouter);
router.use("/webforms", webformsRouter);

module.exports = router;
