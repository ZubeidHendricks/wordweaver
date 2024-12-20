import * as tf from '@tensorflow/tfjs';

class MLService {
  constructor() {
    this.model = null;
    this.learningRate = 0.001;
    this.initialized = false;
  }

  async initializeModel() {
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ units: 64, activation: 'relu', inputShape: [10] }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 4, activation: 'softmax' })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(this.learningRate),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    this.initialized = true;
  }

  preprocessUserData(userProfile) {
    return tf.tensor2d([
      [
        userProfile.averageScore / 100,
        userProfile.successRate,
        userProfile.averageTime / 60000,
        userProfile.hintUsage / 3,
        userProfile.streakLength / 10,
        userProfile.totalGames / 100,
        userProfile.masteryLevel,
        userProfile.learningRate,
        userProfile.motivationScore,
        userProfile.consistencyScore
      ]
    ]);
  }

  async predictDifficulty(userProfile) {
    if (!this.initialized) await this.initializeModel();

    const input = this.preprocessUserData(userProfile);
    const prediction = this.model.predict(input);
    const difficultyDistribution = await prediction.data();

    return {
      beginner: difficultyDistribution[0],
      intermediate: difficultyDistribution[1],
      advanced: difficultyDistribution[2],
      expert: difficultyDistribution[3]
    };
  }

  async updateModel(userProfile, performance) {
    if (!this.initialized) await this.initializeModel();

    const input = this.preprocessUserData(userProfile);
    const actualPerformance = tf.tensor2d([performance]);

    await this.model.fit(input, actualPerformance, {
      epochs: 1,
      batchSize: 1,
      verbose: 0
    });
  }

  predictWordSuccess(word, userProfile) {
    const features = this.extractWordFeatures(word);
    const userFeatures = this.extractUserFeatures(userProfile);
    const combinedFeatures = [...features, ...userFeatures];

    return tf.tidy(() => {
      const input = tf.tensor2d([combinedFeatures]);
      const prediction = this.model.predict(input);
      return prediction.dataSync()[0];
    });
  }

  extractWordFeatures(word) {
    return [
      word.length / 15,
      this.calculateComplexity(word),
      this.calculateUniqueness(word),
      this.calculatePatternDifficulty(word)
    ];
  }

  extractUserFeatures(userProfile) {
    return [
      userProfile.masteryLevel,
      userProfile.averageTime / 60000,
      userProfile.successRate,
      userProfile.learningRate
    ];
  }

  calculateComplexity(word) {
    const complexityFactors = {
      length: word.length / 15,
      uniqueLetters: new Set(word.toLowerCase()).size / word.length,
      consonantClusters: (word.match(/[bcdfghjklmnpqrstvwxyz]{2,}/g) || []).length / word.length,
      rareLetters: (word.match(/[qxjz]/g) || []).length / word.length
    };

    return Object.values(complexityFactors).reduce((sum, val) => sum + val, 0) / 4;
  }

  calculateUniqueness(word) {
    const letterFrequencies = {};
    word.toLowerCase().split('').forEach(letter => {
      letterFrequencies[letter] = (letterFrequencies[letter] || 0) + 1;
    });

    const uniqueness = Object.values(letterFrequencies)
      .reduce((sum, freq) => sum + (freq === 1 ? 1 : 0), 0) / word.length;

    return uniqueness;
  }

  calculatePatternDifficulty(word) {
    const patterns = {
      consonantClusters: /[bcdfghjklmnpqrstvwxyz]{3,}/g,
      repeatedLetters: /(.)\1/g,
      commonPrefixes: /^(un|re|in|dis|over|under)/,
      commonSuffixes: /(ing|ed|tion|ment|ness|ful)$/
    };

    let difficulty = 0;
    difficulty += (word.match(patterns.consonantClusters) || []).length * 0.3;
    difficulty += (word.match(patterns.repeatedLetters) || []).length * 0.2;
    difficulty -= patterns.commonPrefixes.test(word) ? 0.2 : 0;
    difficulty -= patterns.commonSuffixes.test(word) ? 0.2 : 0;

    return Math.max(0, Math.min(1, difficulty));
  }
}

export default new MLService();