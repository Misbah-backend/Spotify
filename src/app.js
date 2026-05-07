const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const musicRoutes = require('./routes/music.routes');

const app = express();

// This middleware lets Express read JSON data from request bodies.
app.use(express.json());

// This middleware reads cookies sent by the browser.
app.use(cookieParser());

// All auth-related routes start with /api/auth (common API pattern).
app.use('/api/auth', authRoutes);

app.use('/api/music', musicRoutes);


module.exports = app;
