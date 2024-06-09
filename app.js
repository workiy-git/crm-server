const serverless = require("serverless-http");
const express = require("express");
const app = express();

const connectToDatabase = require("./config/Database");
const cors = require("cors");
const apiRoutes = require("./routes/api");

const MenuRoutes = require("./model/menu");
const LoginRoutes = require("./model/login");
const webformRouter = require("./model/webformintegration");
const PagesRoutes = require("./model/Pages");

app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.json());

// Connect to MongoDB
connectToDatabase();

app.use("/api", MenuRoutes);
app.use("/api", LoginRoutes);
app.use("/api", webformRouter);
app.use("/api", PagesRoutes);

app.use("/api", apiRoutes);

app.get("/api/info", (req, res) => {
  res.send({ application: "sample-app-app", version: "1" });
});
app.post("/api/v1/getback", (req, res) => {
  res.send({ ...req.body });
});
//app.listen(3000, () => console.log(`Listening on: 3000`));
module.exports.handler = serverless(app);
