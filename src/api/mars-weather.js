const express = require('express');
const axios = require('axios');

const router = express.Router();

const BASE_URL = `https://api.nasa.gov/insight_weather/?`

router.get('/', async (req, res, next) => {
    try {
        const params = new URLSearchParams({
            api_key: process.env.MARS_API_KEY,
            feedtype: 'json',
            ver: '1.0'
        });

        // 1. make a request to the nasa api
        const { data } = await axios.get(`${BASE_URL}${params}`)
        
        // 2. respon to this request with data from nasa api
        res.json(data);
    } catch (error) {
        next(error)
    }

});

module.exports = router;
