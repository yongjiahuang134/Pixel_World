
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();

// enable cors
app.use(cors());

// connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, function(err) {
  if (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
});


app.use(express.json())

const router = require('./routes/fileRoutes')
app.use('/files', router)

app.listen(3000, () => console.log('Start Server'));
