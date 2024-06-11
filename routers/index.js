import express from "express";
import loginRouter from "./loginRouter.js";
import webformintegrationRouter from "./webformintegrationRouter.js" 

const router = express.Router();

router.use("/login", loginRouter);
router.use("/webformintegration", webformintegrationRouter);

export default router;
