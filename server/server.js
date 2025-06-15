const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const setupSwagger = require('./config/swagger');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

setupSwagger(app);

// Database connection
connectDB();

// Basic route
app.get('/api-docs', (req, res) => {
  res.json({ message: 'Vichar.ai API with swagger' });
});

// Routes files
const authRoutes = require('./routes/authRoutes');
const ideaRoutes = require('./routes/ideaRoutes');
const commentRoutes = require('./routes/commentRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/ideas', commentRoutes); // for comment are nested under the ideas
app.use('/api', aiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));