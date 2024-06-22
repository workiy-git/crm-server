import express from "express";
import loginRouter from "./loginRouter.js";
import menuRouter from "./menuRouter.js";
import webformsRouter from "./webformsRouter.js";
const router = express.Router();

router.use("/login", loginRouter);
router.use("/pages", loginRouter);
router.use("/menu", menuRouter);
router.use("/webforms", webformsRouter);

export default router;
