import * as tf from '@tensorflow/tfjs';

class NeuralWordModel {
  constructor() {
    this.encoder = null;
    this.predictor = null;
    this.wordEmbeddings = new Map();
    this.modelConfig = {
      encoderUnits: 128,
      predictorUnits: 64,
      embeddingDim: 100,
      maxWordLength: 15,
      minConfidence: 0.7,
      learningRate: 0.001,
      batchSize: 32
    };
  }

  async initialize() {
    await this.buildEncoderModel();
    await this.buildPredictorModel();
    await this.loadWordEmbeddings();
    this.initializeOptimizer();
  }

  initializeOptimizer() {
    this.optimizer = tf.train.adam(this.modelConfig.learningRate);
  }

  async buildEncoderModel() {
    const { encoderUnits, embeddingDim } = this.modelConfig;

    this.encoder = tf.sequential({
      layers: [
        tf.layers.embedding({
          inputDim: 27,
          outputDim: embeddingDim,
          inputLength: this.modelConfig.maxWordLength
        }),
        tf.layers.bidirectional({
          layer: tf.layers.lstm({ 
            units: encoderUnits, 
            returnSequences: true,
            recurrentDropout: 0.2
          })
        }),
        tf.layers.globalMaxPooling1d(),
        tf.layers.dense({ units: encoderUnits, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: embeddingDim })
      ]
    });

    this.encoder.compile({
      optimizer: this.optimizer,
      loss: 'cosineProximity'
    });
  }

  async buildPredictorModel() {
    const { predictorUnits, embeddingDim } = this.modelConfig;

    this.predictor = tf.sequential({
      layers: [
        tf.layers.dense({
          units: predictorUnits * 2,
          inputShape: [embeddingDim * 2],
          activation: 'relu'
        }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ 
          units: predictorUnits, 
          activation: 'relu',
          kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
        }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    this.predictor.compile({
      optimizer: this.optimizer,
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });
  }

  async adaptToPerformance(userProfile, gameResults) {
    const adaptation = await this.calculateAdaptation(userProfile, gameResults);
    await this.updateModels(adaptation);
    return adaptation;
  }

  async calculateAdaptation(userProfile, gameResults) {
    const currentPerformance = this.analyzePerformance(gameResults);
    const learningRate = this.calculateLearningRate(userProfile, currentPerformance);
    const adaptationStrength = this.calculateAdaptationStrength(currentPerformance);

    return {
      learningRate,
      adaptationStrength,
      performanceMetrics: currentPerformance,
      modelUpdates: this.generateModelUpdates(learningRate, adaptationStrength)
    };
  }

  analyzePerformance(gameResults) {
    const recentGames = gameResults.slice(-10);

    return {
      accuracy: this.calculateAccuracy(recentGames),
      speed: this.calculateSpeed(recentGames),
      difficulty: this.calculateDifficultyProgression(recentGames),
      learningCurve: this.analyzeLearningCurve(recentGames)
    };
  }

  calculateLearningRate(userProfile, currentPerformance) {
    const baseRate = this.modelConfig.learningRate;
    const performanceAdjustment = this.calculatePerformanceAdjustment(currentPerformance);
    const profileAdjustment = this.calculateProfileAdjustment(userProfile);

    return baseRate * performanceAdjustment * profileAdjustment;
  }

  calculatePerformanceAdjustment(performance) {
    const accuracyWeight = 0.4;
    const speedWeight = 0.3;
    const learningCurveWeight = 0.3;

    return (
      performance.accuracy * accuracyWeight +
      performance.speed * speedWeight +
      performance.learningCurve.slope * learningCurveWeight
    );
  }

  calculateProfileAdjustment(userProfile) {
    const consistencyFactor = this.calculateConsistency(userProfile.gameHistory);
    const engagementFactor = this.calculateEngagement(userProfile.gameHistory);

    return (consistencyFactor + engagementFactor) / 2;
  }

  async updateModels(adaptation) {
    const { learningRate, adaptationStrength } = adaptation;

    // Update encoder weights
    const encoderGradients = await this.calculateEncoderGradients(adaptation);
    await this.applyGradients(this.encoder, encoderGradients, learningRate);

    // Update predictor weights
    const predictorGradients = await this.calculatePredictorGradients(adaptation);
    await this.applyGradients(this.predictor, predictorGradients, learningRate);

    return {
      encoderLoss: await this.evaluateEncoderLoss(),
      predictorLoss: await this.evaluatePredictorLoss()
    };
  }

  async evaluateEncoderLoss() {
    const testSample = await this.generateTestSample();
    return this.encoder.evaluate(testSample.input, testSample.target);
  }

  async evaluatePredictorLoss() {
    const testSample = await this.generatePredictorTestSample();
    return this.predictor.evaluate(testSample.input, testSample.target);
  }

  // Helper methods for neural network operations
  async applyGradients(model, gradients, learningRate) {
    const updatedWeights = model.getWeights().map((weight, i) => {
      const gradient = gradients[i];
      return tf.tidy(() => weight.sub(gradient.mul(learningRate)));
    });

    model.setWeights(updatedWeights);
  }

  calculateAccuracy(games) {
    if (!games.length) return 0;
    return games.filter(g => g.success).length / games.length;
  }

  calculateSpeed(games) {
    if (!games.length) return 0;
    const averageTime = games.reduce((sum, g) => sum + g.timeSpent, 0) / games.length;
    return Math.max(0, 1 - (averageTime / 30000)); // Normalize to 30 seconds
  }

  analyzeLearningCurve(games) {
    if (games.length < 2) return { slope: 0, confidence: 0 };

    const scores = games.map(g => g.score);
    const xValues = Array.from({ length: scores.length }, (_, i) => i);

    // Linear regression
    const { slope, intercept } = this.calculateRegression(xValues, scores);
    const confidence = this.calculateRegressionConfidence(scores, slope, intercept);

    return { slope, confidence };
  }

  calculateRegression(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  }

  calculateRegressionConfidence(y, slope, intercept) {
    const yMean = y.reduce((a, b) => a + b, 0) / y.length;
    const ssReg = y.reduce((sum, yi, i) => {
      const yPred = slope * i + intercept;
      return sum + Math.pow(yPred - yMean, 2);
    }, 0);
    const ssTotal = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
    return ssReg / ssTotal; // R-squared value
  }
}

export default new NeuralWordModel();