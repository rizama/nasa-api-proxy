const express = require('express');

const emojis = require('./emojis');

// register the mars-weather endpoint
const mars_weather = require('./mars-weather');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/emojis', emojis);

// use the mars-weather enpoint
router.use('/mars-weather', mars_weather)

module.exports = router;
