const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Database connection
connectDB();

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Vichar.ai API' });
});

// Routes files
const authRoutes = require('./routes/authRoutes');
const ideaRoutes = require('./routes/ideaRoutes');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));