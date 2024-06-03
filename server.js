// server.js

const express = require('express');
const app = express();
const port = 5000;
const connectToDatabase = require('./config/database');
const cors = require('cors');
const apiRoutes = require('./routes/api');

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectToDatabase();

app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
