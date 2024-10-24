const serverless = require("serverless-http");
const express = require("express");

const app = express();

const cors = require("cors");
const routes = require("./routers/index.js");
const connectToDatabase = require("./middlewares/database.js");

app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.json());


// Connect to MongoDB
app.use(connectToDatabase);
app.use("/api", routes);

app.get("/api/info", (req, res) => {
  res.send({ application: "sample-app-app", version: "1" });
});

app.get("/", (req, res) => {
  res.send({ application: "crm-workiy-app", version: "2" });
});
//app.listen(3000, () => console.log(`Listening on: 3000`));

// export const handler = serverless(app);

module.exports.handler = serverless(app);
