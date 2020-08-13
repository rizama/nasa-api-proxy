const express = require('express');
const axios = require('axios');
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

const limiter = rateLimit({
    windowMs: 30 * 1000, // 30 seconds
    max: 30 // limit each IP to 2 requests per windowMs
});

const speedLimiter = slowDown({
    windowMs: 30 * 1000, // 30 seconds
    delayAfter: 1, // allow 1 requests per 30 seconds, then...
    delayMs: 500 // begin adding 500ms of delay per request above 1:
    // request # 2 is delayed by  500ms
    // request # 3 is delayed by 1000ms
    // request # 4 is delayed by 1500ms
    // etc.
});

const router = express.Router();

const BASE_URL = `https://api.nasa.gov/insight_weather/?`

let cacheData;
let cacheTime

// Collection API key for checking, you maybe store this in db
// for authenticate user
const apiKeys = new Map();
apiKeys.set('12345', true);

router.get('/', limiter, speedLimiter, (req, res, next) => {
    const apiKey = req.get('X-API-KEY');
    if (apiKeys.has(apiKey)) {
        next()
    }else{
        const error = new Error('Invalid API KEY');
        next(error);
    }
}, async (req, res, next) => {
    // Memori cache
    if (cacheTime && cacheTime > Date.now() - 30 * 1000) {
        return res.json(cacheData);
    }

    console.log(apiKeys);

    try {
        const params = new URLSearchParams({
            api_key: process.env.MARS_API_KEY,
            feedtype: 'json',
            ver: '1.0'
        });

        // 1. make a request to the nasa api
        const { data } = await axios.get(`${BASE_URL}${params}`)
        cacheData = data;
        cacheTime = Date.now();
        data.cacheTime = cacheTime;
        // 2. respon to this request with data from nasa api
        return res.json(data);
    } catch (error) {
        return next(error)
    }

});

module.exports = router;
