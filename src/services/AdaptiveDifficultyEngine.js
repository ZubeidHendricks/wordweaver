import * as tf from '@tensorflow/tfjs';
import NeuralPredictionService from './NeuralPredictionService';
import CognitiveAnalysisService from './CognitiveAnalysisService';

class AdaptiveDifficultyEngine {
  constructor() {
    this.model = null;
    this.initialized = false;
    this.learningRate = 0.01;
    this.adaptationThreshold = 0.15;
  }

  async initialize() {
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ units: 64, activation: 'relu', inputShape: [12] }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
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

  async calculateOptimalDifficulty(userProfile, recentPerformance) {
    const userState = await this.analyzeUserState(userProfile, recentPerformance);
    const prediction = await this.predictOptimalLevel(userState);

    return {
      difficulty: this.mapPredictionToDifficulty(prediction),
      adaptations: this.generateAdaptations(userState, prediction),
      confidence: prediction.confidence,
      reasoning: this.explainAdaptation(userState, prediction)
    };
  }

  async analyzeUserState(userProfile, recentPerformance) {
    const cognitiveMetrics = await CognitiveAnalysisService.analyzeUserBehavior(
      userProfile.id,
      recentPerformance
    );

    return {
      performanceMetrics: this.calculatePerformanceMetrics(recentPerformance),
      learningCurve: this.analyzeLearningCurve(recentPerformance),
      cognitiveLoad: cognitiveMetrics.cognitiveLoad,
      adaptationHistory: this.analyzeAdaptationHistory(userProfile),
      motivationIndicators: this.assessMotivation(recentPerformance)
    };
  }

  calculatePerformanceMetrics(recentPerformance) {
    const metrics = {
      accuracy: 0,
      speed: 0,
      consistency: 0,
      improvement: 0
    };

    if (recentPerformance.length === 0) return metrics;

    // Calculate accuracy
    metrics.accuracy = recentPerformance.filter(p => p.success).length / 
                      recentPerformance.length;

    // Calculate speed
    const avgTime = recentPerformance.reduce(
      (sum, p) => sum + p.timeSpent, 0
    ) / recentPerformance.length;
    metrics.speed = Math.max(0, 1 - (avgTime / 30000)); // Normalize to 30 seconds

    // Calculate consistency
    const times = recentPerformance.map(p => p.timeSpent);
    const stdDev = this.calculateStandardDeviation(times);
    metrics.consistency = Math.max(0, 1 - (stdDev / avgTime));

    // Calculate improvement
    const firstHalf = recentPerformance.slice(0, Math.floor(recentPerformance.length / 2));
    const secondHalf = recentPerformance.slice(Math.floor(recentPerformance.length / 2));
    const firstAvg = firstHalf.filter(p => p.success).length / firstHalf.length;
    const secondAvg = secondHalf.filter(p => p.success).length / secondHalf.length;
    metrics.improvement = secondAvg - firstAvg;

    return metrics;
  }

  analyzeLearningCurve(recentPerformance) {
    if (recentPerformance.length < 5) return null;

    const scores = recentPerformance.map(p => p.score);
    const timestamps = recentPerformance.map(p => p.timestamp);

    return {
      trend: this.calculateTrend(scores, timestamps),
      plateau: this.detectPlateau(scores),
      volatility: this.calculateVolatility(scores),
      consistency: this.calculateConsistency(scores)
    };
  }

  assessMotivation(recentPerformance) {
    return {
      persistenceScore: this.calculatePersistence(recentPerformance),
      challengeSeeking: this.analyzeChallengePreference(recentPerformance),
      engagementLevel: this.calculateEngagement(recentPerformance),
      frustrationIndicators: this.detectFrustration(recentPerformance)
    };
  }

  async predictOptimalLevel(userState) {
    const features = await this.extractPredictionFeatures(userState);
    const prediction = await this.model.predict(features);
    const probabilities = await prediction.data();

    return {
      difficulty: this.interpretPrediction(probabilities),
      confidence: Math.max(...probabilities),
      distribution: probabilities
    };
  }

  mapPredictionToDifficulty(prediction) {
    const baseLevel = prediction.difficulty;
    const confidence = prediction.confidence;

    // Apply confidence-based smoothing
    const smoothingFactor = 1 - confidence;
    const currentDifficulty = this.getCurrentDifficulty();
    
    return {
      level: baseLevel * confidence + currentDifficulty * smoothingFactor,
      parameters: this.generateDifficultyParameters(baseLevel),
      constraints: this.calculateDifficultyConstraints(prediction)
    };
  }

  generateDifficultyParameters(level) {
    return {
      wordLength: this.calculateWordLength(level),
      timeLimit: this.calculateTimeLimit(level),
      hintAvailability: this.calculateHintAvailability(level),
      complexityFactors: this.determineComplexityFactors(level)
    };
  }

  calculateWordLength(level) {
    const minLength = 3;
    const maxLength = 15;
    const baseLength = Math.round(minLength + (maxLength - minLength) * level);
    
    return {
      min: Math.max(minLength, baseLength - 2),
      max: Math.min(maxLength, baseLength + 2),
      target: baseLength
    };
  }

  calculateTimeLimit(level) {
    const baseTime = 60000; // 60 seconds base
    const minTime = 15000; // 15 seconds minimum
    const scaleFactor = 1 - Math.pow(level, 1.5); // Non-linear scaling
    
    return Math.max(minTime, baseTime * scaleFactor);
  }

  calculateHintAvailability(level) {
    const maxHints = 3;
    const availableHints = Math.max(1, Math.ceil(maxHints * (1 - level)));
    
    return {
      count: availableHints,
      penalty: 0.1 + level * 0.2, // Increased penalty with difficulty
      types: this.determineAvailableHintTypes(level)
    };
  }

  determineComplexityFactors(level) {
    return {
      allowRepeatedLetters: level > 0.3,
      allowConsonantClusters: level > 0.5,
      allowRareLetters: level > 0.7,
      minSyllables: Math.ceil(level * 3),
      semanticComplexity: this.calculateSemanticComplexity(level)
    };
  }

  // Helper methods
  calculateStandardDeviation(values) {
    const avg = values.reduce((a, b) => a + b) / values.length;
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b) / squareDiffs.length;
    return Math.sqrt(avgSquareDiff);
  }

  calculateTrend(scores, timestamps) {
    const n = scores.length;
    if (n < 2) return 0;

    const xMean = timestamps.reduce((a, b) => a + b) / n;
    const yMean = scores.reduce((a, b) => a + b) / n;

    const numerator = timestamps.reduce((sum, x, i) => 
      sum + (x - xMean) * (scores[i] - yMean), 0
    );
    
    const denominator = timestamps.reduce((sum, x) => 
      sum + Math.pow(x - xMean, 2), 0
    );

    return numerator / denominator;
  }

  detectPlateau(scores) {
    if (scores.length < 5) return false;

    const recentScores = scores.slice(-5);
    const mean = recentScores.reduce((a, b) => a + b) / recentScores.length;
    const variance = recentScores.reduce((sum, score) => 
      sum + Math.pow(score - mean, 2), 0
    ) / recentScores.length;

    return variance < 0.01; // Threshold for plateau detection
  }
}

export default new AdaptiveDifficultyEngine();