import express from "express";
import loginRouter from "./loginRouter.js";
import userinfoRouter from "./userinfoRouter.js";

const router = express.Router();

router.use("/login", loginRouter);
router.use("/userinfo", userinfoRouter);

export default router;
