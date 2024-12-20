import * as tf from '@tensorflow/tfjs';

class CognitiveAnalysisService {
  constructor() {
    this.encoderModel = null;
    this.predictionModel = null;
    this.userVectors = new Map();
    this.wordEmbeddings = new Map();
  }

  async initialize() {
    await this.loadModels();
    this.initializeWordEmbeddings();
  }

  async analyzeUserBehavior(userId, gameData) {
    const {
      word,
      timeToSolve,
      mistakeCount,
      hintsUsed,
      success,
      patternRecognition
    } = gameData;

    const behaviorialFeatures = tf.tensor2d([
      [
        timeToSolve / 60000, // Normalize to minutes
        mistakeCount / 5,    // Normalize mistakes
        hintsUsed / 3,       // Normalize hints
        success ? 1 : 0,
        patternRecognition
      ]
    ]);

    const cognitiveState = await this.encoderModel.predict(behaviorialFeatures).array();
    this.updateUserVector(userId, cognitiveState[0]);

    return {
      cognitiveLoad: this.calculateCognitiveLoad(gameData),
      learningCurve: this.analyzeLearningCurve(userId),
      recommendations: this.generatePersonalizedRecommendations(userId),
      predictedDifficulty: this.predictOptimalDifficulty(userId)
    };
  }

  calculateCognitiveLoad(gameData) {
    const timeWeight = 0.4;
    const mistakeWeight = 0.3;
    const hintWeight = 0.2;
    const complexityWeight = 0.1;

    const timeScore = Math.min(gameData.timeToSolve / 30000, 1); // Cap at 30 seconds
    const mistakeScore = Math.min(gameData.mistakeCount / 3, 1);
    const hintScore = gameData.hintsUsed / 3;
    const complexityScore = this.calculateWordComplexity(gameData.word);

    return {
      total: timeScore * timeWeight +
            mistakeScore * mistakeWeight +
            hintScore * hintWeight +
            complexityScore * complexityWeight,
      components: {
        timeImpact: timeScore,
        mistakeImpact: mistakeScore,
        hintDependency: hintScore,
        wordComplexity: complexityScore
      }
    };
  }

  calculateWordComplexity(word) {
    const factors = {
      length: word.length / 15,  // Normalize by max length
      uniqueLetters: new Set(word.toLowerCase()).size / word.length,
      consonantClusters: this.countConsonantClusters(word) / (word.length / 2),
      uncommonLetters: this.countUncommonLetters(word) / word.length
    };

    return Object.values(factors).reduce((sum, value) => sum + value, 0) / Object.keys(factors).length;
  }

  analyzeLearningCurve(userId) {
    const userVector = this.userVectors.get(userId) || [];
    const recentPerformance = userVector.slice(-10); // Last 10 games

    return {
      trend: this.calculateLearningTrend(recentPerformance),
      plateau: this.detectPlateau(recentPerformance),
      volatility: this.calculateVolatility(recentPerformance),
      projectedGrowth: this.projectGrowth(recentPerformance)
    };
  }

  generatePersonalizedRecommendations(userId) {
    const userVector = this.userVectors.get(userId);
    if (!userVector) return [];

    const recommendations = [];
    const learningStyle = this.identifyLearningStyle(userVector);
    const strengths = this.identifyStrengths(userVector);
    const weaknesses = this.identifyWeaknesses(userVector);

    // Generate specific recommendations based on analysis
    if (weaknesses.includes('speed')) {
      recommendations.push({
        type: 'practice',
        focus: 'speed',
        description: 'Practice with shorter words to improve recognition speed',
        exercises: this.generateSpeedExercises()
      });
    }

    if (weaknesses.includes('pattern_recognition')) {
      recommendations.push({
        type: 'study',
        focus: 'patterns',
        description: 'Focus on word patterns and common letter combinations',
        exercises: this.generatePatternExercises()
      });
    }

    return recommendations;
  }

  async predictOptimalDifficulty(userId) {
    const userVector = this.userVectors.get(userId);
    if (!userVector) return 0.5; // Default middle difficulty

    const userTensor = tf.tensor2d([userVector]);
    const prediction = await this.predictionModel.predict(userTensor).array();

    return {
      difficulty: prediction[0][0],
      confidence: prediction[0][1],
      adaptationRate: this.calculateAdaptationRate(userVector)
    };
  }

  // Helper methods
  countConsonantClusters(word) {
    return (word.match(/[bcdfghjklmnpqrstvwxyz]{3,}/g) || []).length;
  }

  countUncommonLetters(word) {
    return (word.match(/[qjxz]/g) || []).length;
  }

  calculateLearningTrend(performance) {
    if (performance.length < 2) return 0;

    const xValues = Array.from({length: performance.length}, (_, i) => i);
    const yValues = performance;

    // Simple linear regression
    const n = performance.length;
    const sumX = xValues.reduce((a, b) => a + b);
    const sumY = yValues.reduce((a, b) => a + b);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
    const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  }

  detectPlateau(performance) {
    if (performance.length < 5) return false;

    const recentScores = performance.slice(-5);
    const mean = recentScores.reduce((a, b) => a + b) / recentScores.length;
    const variance = recentScores.reduce((sum, score) => 
      sum + Math.pow(score - mean, 2), 0) / recentScores.length;

    return variance < 0.01; // Threshold for plateau detection
  }

  calculateVolatility(performance) {
    if (performance.length < 2) return 0;

    const differences = performance.slice(1).map((score, i) => 
      Math.abs(score - performance[i]));

    return differences.reduce((a, b) => a + b) / differences.length;
  }

  projectGrowth(performance) {
    const trend = this.calculateLearningTrend(performance);
    const volatility = this.calculateVolatility(performance);
    const plateau = this.detectPlateau(performance);

    return {
      shortTerm: trend * (1 - volatility) * (plateau ? 0.5 : 1),
      longTerm: trend * 0.7, // Assume some regression to the mean
      confidence: 1 - volatility
    };
  }

  private async loadModels() {
    // Load pre-trained TensorFlow.js models
    this.encoderModel = await tf.loadLayersModel('path/to/encoder/model');
    this.predictionModel = await tf.loadLayersModel('path/to/prediction/model');
  }

  private updateUserVector(userId, newState) {
    const currentVector = this.userVectors.get(userId) || [];
    this.userVectors.set(userId, [...currentVector, ...newState]);

    // Keep only recent history
    if (currentVector.length > 100) {
      this.userVectors.set(userId, currentVector.slice(-100));
    }
  }
}

export default new CognitiveAnalysisService();