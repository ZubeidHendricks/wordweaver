const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const adController = require('./controllers/adController');

router.get('/data', gameController.getGameData);
router.get('/daily-challenge',gameController.getDailyChallenge);
router.get('/game/:gameId/ad-availability', adController.checkAdAvailability);
router.post('/game/:gameId/show-ad', adController.showAd);
router.post('/game/:gameId/reset-ad-rewards', adController.resetAdRewards);

module.exports = router;