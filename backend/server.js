require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cadets', require('./routes/cadets'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/fines', require('./routes/fines'));
app.use('/api/exemptions', require('./routes/exemptions'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/camps', require('./routes/camps'));
app.use('/api/competitions', require('./routes/competitions'));

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: "DTU 1 DBN NCC Unit API Active" });
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
