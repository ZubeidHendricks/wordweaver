const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');

router.post('/create', challengeController.createChallenge);
router.get('/pending', challengeController.getPendingChallenges);
router.post('/accept/:id', challengeController.acceptChallenge);
router.post('/complete/:id', challengeController.completeChallenge);

module.exports = router;