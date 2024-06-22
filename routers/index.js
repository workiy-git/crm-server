const express = require("express");
const loginRouter = require("./loginRouter.js");
const menuRouter = require("./menuRouter.js");
const webformsRouter = require("./webformsRouter.js");
const router = express.Router();

router.use("/login", loginRouter);
router.use("/pages", loginRouter); // Note: This seems to be using loginRouter for "/pages" as well, which might be a mistake unless intentional.
router.use("/menu", menuRouter);
router.use("/webforms", webformsRouter);

module.exports = router;
