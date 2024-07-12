exports.updateStats = async (req, res) => {
    try {
      const { score, wordsGuessed, timeTaken } = req.body;
      const user = await User.findById(req.user._id);
      
      user.stats.gamesPlayed += 1;
      user.stats.totalScore += score;
      user.stats.totalWordsGuessed += wordsGuessed;
      user.stats.totalTimePlayed += timeTaken;
      
      if (score > user.stats.highestScore) {
        user.stats.highestScore = score;
      }
      
      user.stats.averageScore = user.stats.totalScore / user.stats.gamesPlayed;
      
      await user.save();
      
      res.json(user.stats);
    } catch (error) {
      res.status(500).json({ message: 'Error updating stats', error });
    }
  };