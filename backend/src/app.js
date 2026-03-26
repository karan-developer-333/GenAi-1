const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors({ 
    origin: ['http://localhost:3001', 'http://localhost:3000', 'chrome-extension://*'], 
    credentials: true 
}));
app.use(bodyParser.json());
app.use(express.static(config.PUBLIC_DIR));

// Routes
app.use('/api', routes);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
