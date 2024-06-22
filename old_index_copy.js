// server.js

const express = require("express");
const serverless = require("serverless-http");
const app = express();
const port = 5000;
const cors = require("cors");

// const connectToDatabase = require("./config/database");

import routes from "./routers/index.js";
import connectToDatabase from "./middlewares/database.js";

// const apiRoutes = require("./routes/api");

// const MenuRoutes = require("./model/menu");
// const LoginRoutes = require("./model/login");
// const PagesRoutes = require("./model/Pages");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/hello", (req, res) => {
  res.send({ application: "sample-app - index", version: "1" });
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB
// connectToDatabase();
app.use(connectToDatabase);

app.get("/test", (req, res) => {
  res.send("Hello from the example route!");
});
app.use("/api", routes);

// app.use("/api", MenuRoutes);
// app.use("/api", LoginRoutes);
// app.use("/api", PagesRoutes);

// app.use("/api", apiRoutes);

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

module.exports.handler = serverless(app);
