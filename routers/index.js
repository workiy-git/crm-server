import express from "express";
import loginRouter from "./loginRouter.js";
import menuRouter from "./menuRouter.js";
import webformintegrationRouter from "./webformintegrationRouter.js";

const router = express.Router();

router.use("/login", loginRouter);
router.use("/menu", menuRouter);
router.use("/webformintegration", webformintegrationRouter);

export default router;
