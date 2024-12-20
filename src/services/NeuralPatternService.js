import * as tf from '@tensorflow/tfjs';

class NeuralPatternService {
  constructor() {
    this.encoderModel = null;
    this.patternModel = null;
    this.predictionModel = null;
    this.wordEmbeddings = new Map();
    this.patternCache = new Map();
    
    this.modelConfig = {
      sequenceLength: 20,
      embeddingDim: 128,
      hiddenUnits: 256,
      attentionHeads: 8
    };
  }

  async initialize() {
    await this.buildEncoder();
    await this.buildPatternRecognizer();
    await this.buildPredictionModel();
  }

  async buildEncoder() {
    const { sequenceLength, embeddingDim } = this.modelConfig;

    this.encoderModel = tf.sequential({
      layers: [
        tf.layers.embedding({
          inputDim: 128, // Vocabulary size
          outputDim: embeddingDim,
          inputLength: sequenceLength,
          maskZero: true
        }),
        tf.layers.bidirectional({
          layer: tf.layers.lstm({
            units: embeddingDim,
            returnSequences: true,
            recurrentDropout: 0.2
          })
        }),
        tf.layers.multiHeadAttention({
          numHeads: this.modelConfig.attentionHeads,
          keyDim: embeddingDim / this.modelConfig.attentionHeads
        }),
        tf.layers.globalMaxPooling1d(),
        tf.layers.dense({ units: embeddingDim, activation: 'relu' })
      ]
    });
  }

  async buildPatternRecognizer() {
    const { hiddenUnits } = this.modelConfig;

    this.patternModel = tf.sequential({
      layers: [
        tf.layers.dense({
          units: hiddenUnits,
          activation: 'relu',
          inputShape: [this.modelConfig.embeddingDim * 2]
        }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({
          units: hiddenUnits / 2,
          activation: 'relu',
          kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
        }),
        tf.layers.dense({
          units: hiddenUnits / 4,
          activation: 'relu'
        }),
        tf.layers.dense({
          units: 64,
          activation: 'sigmoid'
        })
      ]
    });

    this.patternModel.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });
  }

  async buildPredictionModel() {
    this.predictionModel = tf.sequential({
      layers: [
        tf.layers.dense({
          units: this.modelConfig.hiddenUnits,
          activation: 'relu',
          inputShape: [this.modelConfig.embeddingDim + 64] // Combined embeddings and patterns
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({
          units: this.modelConfig.hiddenUnits / 2,
          activation: 'relu'
        }),
        tf.layers.dense({
          units: 128, // Word prediction space
          activation: 'softmax'
        })
      ]
    });

    this.predictionModel.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
  }

  async analyzePattern(word, userContext) {
    const wordVector = await this.getWordEmbedding(word);
    const contextVector = await this.getContextEmbedding(userContext);
    const patterns = await this.detectPatterns(wordVector, contextVector);

    return {
      patterns: this.interpretPatterns(patterns),
      complexity: this.calculatePatternComplexity(patterns),
      similarities: await this.findSimilarPatterns(patterns),
      predictions: await this.generatePredictions(patterns, userContext)
    };
  }

  async detectPatterns(wordVector, contextVector) {
    const combined = tf.concat([wordVector, contextVector]);
    const prediction = this.patternModel.predict(combined.expandDims(0));
    return prediction.dataSync();
  }

  interpretPatterns(patterns) {
    const patternTypes = [
      'phonetic',
      'morphological',
      'semantic',
      'syntactic',
      'orthographic',
      'frequency',
      'difficulty',
      'cognitive_load'
    ];

    return patterns.map((strength, i) => ({
      type: patternTypes[i],
      strength,
      description: this.getPatternDescription(patternTypes[i], strength)
    }));
  }

  async findSimilarPatterns(patterns) {
    const patternTensor = tf.tensor1d(patterns);
    const similarities = [];

    for (const [word, cached] of this.patternCache.entries()) {
      const similarity = await this.calculateCosineSimilarity(
        patternTensor,
        tf.tensor1d(cached.patterns)
      );

      similarities.push({
        word,
        similarity,
        patterns: cached.patterns
      });
    }

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);
  }

  async generatePredictions(patterns, userContext) {
    const patternTensor = tf.tensor1d(patterns);
    const contextVector = await this.getContextEmbedding(userContext);
    const combined = tf.concat([patternTensor, contextVector]);

    const prediction = this.predictionModel.predict(combined.expandDims(0));
    const probabilities = await prediction.data();

    return this.rankPredictions(probabilities, patterns);
  }

  calculatePatternComplexity(patterns) {
    const weights = {
      phonetic: 0.15,
      morphological: 0.2,
      semantic: 0.25,
      syntactic: 0.15,
      orthographic: 0.1,
      frequency: 0.05,
      difficulty: 0.05,
      cognitive_load: 0.05
    };

    return patterns.reduce((complexity, pattern, i) => 
      complexity + pattern * weights[Object.keys(weights)[i]], 0);
  }

  getPatternDescription(type, strength) {
    const descriptions = {
      phonetic: strength => `Sound pattern confidence: ${(strength * 100).toFixed(1)}%`,
      morphological: strength => `Word structure complexity: ${(strength * 100).toFixed(1)}%`,
      semantic: strength => `Meaning association strength: ${(strength * 100).toFixed(1)}%`,
      syntactic: strength => `Grammar pattern confidence: ${(strength * 100).toFixed(1)}%`,
      orthographic: strength => `Spelling pattern strength: ${(strength * 100).toFixed(1)}%`,
      frequency: strength => `Usage frequency level: ${(strength * 100).toFixed(1)}%`,
      difficulty: strength => `Overall difficulty: ${(strength * 100).toFixed(1)}%`,
      cognitive_load: strength => `Cognitive demand: ${(strength * 100).toFixed(1)}%`
    };

    return descriptions[type](strength);
  }

  async getWordEmbedding(word) {
    if (this.wordEmbeddings.has(word)) {
      return this.wordEmbeddings.get(word);
    }

    const encoded = await this.encoderModel.predict(
      tf.tensor2d([this.tokenizeWord(word)])
    ).data();

    const embedding = Array.from(encoded);
    this.wordEmbeddings.set(word, embedding);
    return embedding;
  }

  tokenizeWord(word) {
    return word.split('').map(char => char.charCodeAt(0));
  }

  async getContextEmbedding(userContext) {
    const contextFeatures = [
      userContext.skillLevel,
      userContext.learningRate,
      userContext.recentAccuracy,
      userContext.cognitiveLoad,
      ...userContext.recentPatterns
    ];

    return tf.tensor1d(contextFeatures).arraySync();
  }

  async calculateCosineSimilarity(tensor1, tensor2) {
    const dotProduct = tensor1.dot(tensor2);
    const norm1 = tensor1.norm();
    const norm2 = tensor2.norm();
    return dotProduct.div(norm1.mul(norm2)).dataSync()[0];
  }

  rankPredictions(probabilities, patterns) {
    const predictions = probabilities
      .map((prob, i) => ({
        word: this.indexToWord(i),
        probability: prob,
        complexity: this.calculatePatternComplexity(patterns),
        confidence: prob * (1 - this.calculatePatternComplexity(patterns))
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);

    return {
      bestMatch: predictions[0],
      alternatives: predictions.slice(1),
      confidence: predictions[0].confidence,
      reasoning: this.generatePredictionReasoning(predictions[0], patterns)
    };
  }

  generatePredictionReasoning(prediction, patterns) {
    const dominantPatterns = this.interpretPatterns(patterns)
      .filter(p => p.strength > 0.7)
      .map(p => p.description);

    return {
      mainFactors: dominantPatterns,
      confidence: `${(prediction.confidence * 100).toFixed(1)}% certain`,
      complexity: `Pattern complexity: ${(prediction.complexity * 100).toFixed(1)}%`,
      suggestion: this.generateLearningSuggestion(patterns)
    };
  }
}

export default new NeuralPatternService();