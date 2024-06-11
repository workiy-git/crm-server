import express from "express";
import loginRouter from "./loginRouter.js";

const router = express.Router();

router.use("/login", loginRouter);

export default router;
