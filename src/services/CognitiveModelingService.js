class CognitiveModelingService {
  constructor() {
    this.learningRate = 0.1;
    this.memoryDecayRate = 0.05;
    this.difficultyThreshold = 0.7;
  }

  // Calculate cognitive load based on word complexity and user performance
  calculateCognitiveLoad(word, userMetrics) {
    const wordComplexity = this.analyzeWordComplexity(word);
    const userPerformance = this.analyzeUserPerformance(userMetrics);
    const timeScoreImpact = this.calculateTimeImpact(userMetrics.responseTime);

    return {
      totalLoad: (wordComplexity * 0.4 + userPerformance * 0.4 + timeScoreImpact * 0.2),
      complexity: wordComplexity,
      performance: userPerformance,
      timeImpact: timeScoreImpact
    };
  }

  // Analyze word complexity using linguistic features
  analyzeWordComplexity(word) {
    const features = {
      length: word.length / 12, // Normalized by max length
      uniqueLetters: new Set(word.toLowerCase()).size / word.length,
      vowelConsonantRatio: this.calculateVowelRatio(word),
      repeatedPatterns: this.detectRepeatedPatterns(word),
      commonPrefixSuffix: this.hasCommonAffixes(word)
    };

    return Object.values(features).reduce((sum, value) => sum + value, 0) / Object.keys(features).length;
  }

  // Analyze user's historical performance
  analyzeUserPerformance(metrics) {
    const {
      successRate,
      averageTime,
      hintUsage,
      streakLength,
      difficultyProgression
    } = metrics;

    const performanceScore = (
      (successRate * 0.3) +
      (this.normalizeTime(averageTime) * 0.2) +
      (this.normalizeHintUsage(hintUsage) * 0.2) +
      (this.normalizeStreak(streakLength) * 0.15) +
      (difficultyProgression * 0.15)
    );

    return Math.min(Math.max(performanceScore, 0), 1);
  }

  // Calculate optimal next word difficulty
  calculateNextWordDifficulty(userProfile) {
    const currentMastery = userProfile.masteryLevel;
    const recentPerformance = userProfile.recentPerformance;
    const learningRate = userProfile.learningRate;

    const targetDifficulty = currentMastery + 
      (recentPerformance > 0.8 ? learningRate : -learningRate);

    return {
      difficulty: Math.min(Math.max(targetDifficulty, 0.1), 1.0),
      adaptationReason: this.getAdaptationReason(currentMastery, recentPerformance)
    };
  }

  // Helper methods
  calculateVowelRatio(word) {
    const vowels = word.toLowerCase().match(/[aeiou]/g)?.length || 0;
    return vowels / word.length;
  }

  detectRepeatedPatterns(word) {
    // Detect repeating letter patterns
    const patterns = word.match(/(.+)\1+/g);
    return patterns ? patterns.length / word.length : 0;
  }

  hasCommonAffixes(word) {
    const commonPrefixes = ['un', 're', 'in', 'dis', 'en', 'non', 'pre'];
    const commonSuffixes = ['ing', 'ed', 'tion', 'able', 'ible', 'ful', 'ness'];

    const hasPrefix = commonPrefixes.some(prefix => 
      word.toLowerCase().startsWith(prefix));
    const hasSuffix = commonSuffixes.some(suffix => 
      word.toLowerCase().endsWith(suffix));

    return (hasPrefix || hasSuffix) ? 1 : 0;
  }

  normalizeTime(time) {
    const optimalTime = 15000; // 15 seconds as optimal response time
    return Math.min(time / optimalTime, 1);
  }

  normalizeHintUsage(hints) {
    return Math.max(1 - (hints / 3), 0); // Assuming max 3 hints
  }

  normalizeStreak(streak) {
    return Math.min(streak / 10, 1); // Normalize to max streak of 10
  }

  getAdaptationReason(mastery, performance) {
    if (performance > 0.8) return 'Excellent performance - increasing difficulty';
    if (performance < 0.4) return 'Struggling - decreasing difficulty';
    return 'Maintaining current difficulty level';
  }

  // Generate personalized learning insights
  generateInsights(userProfile) {
    return {
      strengths: this.analyzeLearningStrengths(userProfile),
      weaknesses: this.analyzeLearningWeaknesses(userProfile),
      recommendations: this.generateRecommendations(userProfile),
      progressTrend: this.calculateProgressTrend(userProfile)
    };
  }

  analyzeLearningStrengths(userProfile) {
    const strengths = [];
    if (userProfile.averageTime < 10000) strengths.push('Quick recognition');
    if (userProfile.successRate > 0.8) strengths.push('High accuracy');
    if (userProfile.streakLength > 5) strengths.push('Consistent performance');
    return strengths;
  }

  analyzeLearningWeaknesses(userProfile) {
    const weaknesses = [];
    if (userProfile.hintUsage > 2) weaknesses.push('Hint dependency');
    if (userProfile.averageTime > 30000) weaknesses.push('Slow response time');
    if (userProfile.successRate < 0.5) weaknesses.push('Low accuracy');
    return weaknesses;
  }

  generateRecommendations(userProfile) {
    const recommendations = [];
    
    if (userProfile.hintUsage > 2) {
      recommendations.push('Try solving without hints to improve memory');
    }
    
    if (userProfile.averageTime > 30000) {
      recommendations.push('Focus on speed training with easier words');
    }
    
    if (userProfile.successRate < 0.5) {
      recommendations.push('Practice with a lower difficulty level');
    }
    
    return recommendations;
  }

  calculateProgressTrend(userProfile) {
    const recentScores = userProfile.recentScores || [];
    if (recentScores.length < 2) return 'Not enough data';
    
    const trend = recentScores.slice(-5);
    const average = trend.reduce((a, b) => a + b, 0) / trend.length;
    const firstHalf = trend.slice(0, Math.floor(trend.length / 2));
    const secondHalf = trend.slice(Math.floor(trend.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    if (secondAvg > firstAvg * 1.1) return 'Improving';
    if (secondAvg < firstAvg * 0.9) return 'Declining';
    return 'Stable';
  }
}

export default new CognitiveModelingService();