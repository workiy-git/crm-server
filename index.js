// server.js

const express = require('express');
const serverless = require('serverless-http');
const app = express();
const port = 5000;
const connectToDatabase = require('./config/database');
const cors = require('cors');
const apiRoutes = require('./routes/api');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get('/hello', (req, res) => {
  res.send({ application: 'sample-app', version: '1' });
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectToDatabase();

app.use('/api', apiRoutes);

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

module.exports.handler = serverless(app);
