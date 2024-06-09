// server.js

const express = require("express");
const app = express();
const port = 5000;
const connectToDatabase = require("./config/database");
const cors = require("cors");
const apiRoutes = require("./routes/api");

const MenuRoutes = require("./model/menu");
const LoginRoutes = require("./model/login");
const webformRouter = require("./model/webformintegration");
const PagesRoutes = require("./model/Pages");

app.use(cors());
app.use(express.json());

app.use("/api", MenuRoutes);
app.use("/api", LoginRoutes);
app.use("/api", webformRouter);
app.use("/api", PagesRoutes);

// Connect to MongoDB
connectToDatabase();

app.use("/api", apiRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
