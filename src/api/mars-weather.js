const express = require('express');
const axios = require('axios');

const router = express.Router();

const BASE_URL = `https://api.nasa.gov/insight_weather/?`

let cacheData;
let cacheTime;

router.get('/', async (req, res, next) => {
    // Memori cache
    if (cacheTime && cacheTime > Date.now() - 30 * 1000) {
        return res.json(cacheData);
    }

    try {
        const params = new URLSearchParams({
            api_key: process.env.MARS_API_KEY,
            feedtype: 'json',
            ver: '1.0'
        });

        // 1. make a request to the nasa api
        const { data } = await axios.get(`${BASE_URL}${params}`)
        cacheData = data;
        cacheTime= Date.now();
        data.cacheTime = cacheTime;
        // 2. respon to this request with data from nasa api
        return res.json(data);
    } catch (error) {
        return next(error)
    }

});

module.exports = router;
