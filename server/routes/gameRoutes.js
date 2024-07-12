const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.get('/data', gameController.getGameData);
router.get('/daily-challenge',gameController.getDailyChallenge);

module.exports = router;