const Game = require('../models/GameModel');

exports.checkAdAvailability = async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const adsAvailable = game.adRewardsAvailable > game.adRewardsUsed;
    res.json({ adsAvailable });
  } catch (error) {
    res.status(500).json({ message: 'Error checking ad availability', error });
  }
};

exports.showAd = async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (game.adRewardsUsed >= game.adRewardsAvailable) {
      return res.status(400).json({ message: 'No more ads available' });
    }

    // Update game state
    game.adRewardsUsed += 1;
    game.lastAdRewardTime = new Date();
    await game.save();

    // Return reward to the player
    res.json({ 
      message: 'Ad shown successfully', 
      reward: {
        type: 'hint',
        value: 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error showing ad', error });
  }
};

exports.resetAdRewards = async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Reset ad rewards daily
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    if (!game.lastAdRewardTime || game.lastAdRewardTime < oneDayAgo) {
      game.adRewardsUsed = 0;
      await game.save();
    }

    res.json({ message: 'Ad rewards reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting ad rewards', error });
  }
};