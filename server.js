import express from "express";
const app = express();
const port = 5000;
import cors from "cors";

import routes from "./routers/index.js";
import connectToDatabase from "./middlewares/database.js";

app.use(cors());
app.use(express.json());

app.use(connectToDatabase);

app.get("/test", (req, res) => {
  res.send("Hello from the example route!");
});
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
