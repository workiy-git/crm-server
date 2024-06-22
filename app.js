import serverless from "serverless-http";
import express from "express";

const app = express();

import cors from "cors";
import routes from "./routers/index.js";
import connectToDatabase from "./middlewares/database.js";

app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.json());

// Connect to MongoDB
app.use(connectToDatabase);
app.use("/api", routes);

app.get("/api/info", (req, res) => {
  res.send({ application: "sample-app-app", version: "1" });
});

//app.listen(3000, () => console.log(`Listening on: 3000`));

export const handler = serverless(app);
