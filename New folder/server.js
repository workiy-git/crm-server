const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");

const routes = require("./routers/index.js");
const connectToDatabase = require("./middlewares/database.js");

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
