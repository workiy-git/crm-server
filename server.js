// server.js

const express = require('express');
const app = express();
const port = 9000;

const bodyParser = require('body-parser');
const connectToDatabase = require('./config/Database');
// Connect to MongoDB
connectToDatabase();
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
