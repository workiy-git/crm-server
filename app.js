import serverless from "serverless-http";
import express from "express";
import cors from "cors";
import routes from "./routers/index.js";
import connectToDatabase from "./middlewares/database.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.json());

// Connect to MongoDB
app.use(connectToDatabase);

app.get("/test", (req, res) => {
  res.send("Hello from the example route!");
});

app.use("/api", routes);

//app.listen(3000, () => console.log(`Listening on: 3000`));

export const handler = serverless(app);
