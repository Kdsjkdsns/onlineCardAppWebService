// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Import your routes
const cardRoutes = require('./routes/cardRoutes'); // adjust path if needed
const authRoutes = require('./routes/authRoutes'); // adjust path if needed

// Middleware
app.use(express.json());

// Enable CORS for your frontend
app.use(cors({
  origin: 'https://c219-card-app-41x4.onrender.com', // frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // if using cookies/auth
}));

// Routes
app.use('/allCard', cardRoutes);
app.use('/login', authRoutes);

// Root route (optional)
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
