const serverless = require('serverless-http');
const express = require('express');
const app = express();

const connectToDatabase = require('./config/Database');
const cors = require('cors');
const apiRoutes = require('./routes/api');

app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.json());

// Connect to MongoDB
connectToDatabase();

app.use('/api', apiRoutes);

app.get('/api/info', (req, res) => {
  res.send({ application: 'sample-app', version: '1' });
});
// app.post('/api/v1/getback', (req, res) => {
//   res.send({ ...req.body });
// });
//app.listen(3000, () => console.log(`Listening on: 3000`));
module.exports.handler = serverless(app);