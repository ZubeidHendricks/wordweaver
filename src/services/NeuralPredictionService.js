import * as tf from '@tensorflow/tfjs';
import CognitiveAnalysisService from './CognitiveAnalysisService';

class NeuralPredictionService {
  constructor() {
    this.wordModel = null;
    this.stateVector = null;
    this.initialized = false;
    this.batchSize = 32;
    this.hiddenSize = 128;
  }

  async initialize() {
    this.wordModel = tf.sequential({
      layers: [
        tf.layers.lstm({
          units: this.hiddenSize,
          inputShape: [null, 256],
          returnSequences: true
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 128, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.1 }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    this.wordModel.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    this.initialized = true;
  }

  async predictNextWord(userProfile, context) {
    if (!this.initialized) await this.initialize();

    const userState = await CognitiveAnalysisService.getUserState(userProfile);
    const contextVector = this.encodeContext(context);
    const combinedInput = this.combineInputs(userState, contextVector);

    const prediction = await this.wordModel.predict(combinedInput);
    return this.decodeWordPrediction(prediction);
  }

  async updateModel(trainingData) {
    const { inputs, labels } = this.preprocessTrainingData(trainingData);
    
    await this.wordModel.fit(inputs, labels, {
      batchSize: this.batchSize,
      epochs: 1,
      shuffle: true,
      validationSplit: 0.1
    });
  }

  encodeContext(context) {
    // Implement advanced context encoding
    const features = {
      recentWords: context.recentWords.map(w => this.wordToVector(w)),
      difficulty: context.difficulty,
      category: this.encodeCategoryVector(context.category),
      timeOfDay: this.normalizeTimeOfDay(context.timestamp),
      userPerformance: context.performanceMetrics
    };

    return tf.tensor(this.flattenFeatures(features));
  }

  wordToVector(word) {
    // Convert word to numerical vector using advanced embedding
    const embedding = new Array(256).fill(0);
    const chars = word.toLowerCase().split('');
    
    chars.forEach((char, i) => {
      const code = char.charCodeAt(0) - 97;
      if (code >= 0 && code < 26) {
        embedding[code + i * 26] = 1;
      }
    });

    return embedding;
  }

  encodeCategoryVector(category) {
    const categories = [
      'general', 'science', 'nature', 'technology', 
      'arts', 'history', 'sports', 'entertainment'
    ];
    
    return categories.map(c => c === category ? 1 : 0);
  }

  normalizeTimeOfDay(timestamp) {
    const hour = new Date(timestamp).getHours();
    return hour / 24;
  }

  combineInputs(userState, contextVector) {
    return tf.concat([userState, contextVector]);
  }

  decodeWordPrediction(prediction) {
    const probabilities = prediction.dataSync();
    const wordScores = this.vocabulary.map((word, i) => ({
      word,
      score: probabilities[i],
      complexity: this.calculateWordComplexity(word)
    }));

    return this.rankPredictions(wordScores);
  }

  calculateWordComplexity(word) {
    const features = {
      length: word.length / 15,
      uniqueChars: new Set(word).size / word.length,
      consonantClusters: (word.match(/[bcdfghjklmnpqrstvwxyz]{3,}/g) || []).length,
      uncommonChars: (word.match(/[jqxz]/g) || []).length,
      syllables: this.countSyllables(word)
    };

    return Object.values(features).reduce((a, b) => a + b) / Object.keys(features).length;
  }

  countSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;

    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    return word.match(/[aeiouy]{1,2}/g)?.length || 1;
  }

  rankPredictions(wordScores) {
    return wordScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(({ word, score, complexity }) => ({
        word,
        confidence: score,
        complexity,
        recommendation: this.generateRecommendation(score, complexity)
      }));
  }

  generateRecommendation(score, complexity) {
    if (score > 0.8 && complexity < 0.6) return 'Optimal Challenge';
    if (score > 0.8 && complexity >= 0.6) return 'Stretch Goal';
    if (score > 0.5) return 'Learning Opportunity';
    return 'Review Needed';
  }
}

export default new NeuralPredictionService();