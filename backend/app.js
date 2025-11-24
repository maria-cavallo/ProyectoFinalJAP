const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/api', apiRoutes);
app.use('/auth',authRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'emercado local API modularizada' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
