// backend/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const redis = require('redis');
const User = require('C:\Users\manth\Downloads\Stockify\backend\models\User.js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Redis client
const redisClient = redis.createClient();
redisClient.on('error', (err) => console.error('Redis Client Error', err));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Endpoint to fetch stock data from Yahoo Finance
app.get('/api/stock/:symbol', async (req, res) => {
    const { symbol } = req.params;

    // Check Redis cache first
    redisClient.get(symbol, async (err, cachedData) => {
        if (err) return res.status(500).json({ error: 'Redis error' });

        if (cachedData) {
            // Return cached data
            return res.json(JSON.parse(cachedData));
        } else {
            // Fetch from Yahoo Finance API
            try {
                const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
                const stockData = response.data.chart.result[0];

                if (!stockData) {
                    return res.status(404).json({ error: 'Stock not found' });
                }

                const { timestamp, indicators } = stockData;
                const prices = indicators.quote[0];

                const formattedData = timestamp.map((time, index) => ({
                    time: new Date(time * 1000).toLocaleDateString(),
                    open: prices.open[index],
                    high: prices.high[index],
                    low: prices.low[index],
                    close: prices.close[index],
                    volume: prices.volume[index],
                }));

                // Cache the result in Redis for 1 hour
                redisClient.setex(symbol, 3600, JSON.stringify(formattedData));

                res.json(formattedData);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Failed to fetch stock data' });
            }
        }
    });
});

// User registration
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser  = new User({ username, password: hashedPassword });
        await newUser .save();
        res.status(201).json({ message: 'User  registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// User login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status( 401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:5000}`);
}); 
