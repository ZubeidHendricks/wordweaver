import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AdaptiveDifficultyEngine from '../services/AdaptiveDifficultyEngine';
import NeuralPredictionService from '../services/NeuralPredictionService';
import CognitiveAnalysisService from '../services/CognitiveAnalysisService';
import PsychologicalAdaptationService from '../services/PsychologicalAdaptationService';

const GameContext = createContext();

const initialState = {
  userId: null,
  currentWord: null,
  difficulty: 0.5,
  score: 0,
  streak: 0,
  hints: [],
  gameHistory: [],
  achievements: [],
  learningProfile: null,
  adaptiveSettings: null,
  cognitiveState: null,
  motivationState: null,
  loading: true,
  error: null,
  neuralState: {
    wordPredictions: [],
    confidenceLevel: 0,
    adaptationHistory: []
  },
  performanceMetrics: {
    accuracyTrend: [],
    speedTrend: [],
    difficultyProgression: [],
    learningRate: 0
  }
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'INITIALIZE_GAME':
      return {
        ...state,
        userId: action.payload.userId,
        learningProfile: action.payload.profile,
        adaptiveSettings: action.payload.settings,
        loading: false
      };

    case 'START_ROUND':
      return {
        ...state,
        currentWord: action.payload.word,
        difficulty: action.payload.difficulty,
        hints: [],
        startTime: Date.now(),
        neuralState: {
          ...state.neuralState,
          wordPredictions: action.payload.predictions,
          confidenceLevel: action.payload.confidence
        }
      };

    case 'SUBMIT_GUESS':
      return {
        ...state,
        score: state.score + action.payload.points,
        streak: action.payload.success ? state.streak + 1 : 0,
        gameHistory: [...state.gameHistory, action.payload.roundData],
        performanceMetrics: {
          ...state.performanceMetrics,
          accuracyTrend: [...state.performanceMetrics.accuracyTrend, action.payload.accuracy],
          speedTrend: [...state.performanceMetrics.speedTrend, action.payload.speed]
        }
      };

    case 'UPDATE_COGNITIVE_STATE':
      return {
        ...state,
        cognitiveState: action.payload.cognitiveState,
        motivationState: action.payload.motivationState,
        adaptiveSettings: action.payload.adaptiveSettings,
        performanceMetrics: {
          ...state.performanceMetrics,
          learningRate: action.payload.learningRate
        }
      };

    case 'NEURAL_ADAPTATION':
      return {
        ...state,
        neuralState: {
          ...state.neuralState,
          adaptationHistory: [...state.neuralState.adaptationHistory, action.payload],
          confidenceLevel: action.payload.newConfidence
        }
      };

    case 'UNLOCK_ACHIEVEMENT':
      return {
        ...state,
        achievements: [...state.achievements, action.payload.achievement]
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload.error,
        loading: false
      };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Initialize game services
  useEffect(() => {
    async function initializeServices() {
      try {
        await Promise.all([
          AdaptiveDifficultyEngine.initialize(),
          NeuralPredictionService.initialize(),
          CognitiveAnalysisService.initialize()
        ]);

        const userId = generateUserId();
        const initialProfile = await initializeUserProfile(userId);

        dispatch({
          type: 'INITIALIZE_GAME',
          payload: {
            userId,
            profile: initialProfile.learningProfile,
            settings: initialProfile.adaptiveSettings
          }
        });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: { error: 'Failed to initialize game services' }
        });
      }
    }

    initializeServices();
  }, []);

  // Neural adaptation and learning
  useEffect(() => {
    if (!state.currentWord || !state.gameHistory.length) return;

    async function adaptNeuralSystem() {
      try {
        const recentPerformance = state.gameHistory.slice(-5);
        const cognitiveAnalysis = await CognitiveAnalysisService
          .analyzeUserBehavior(state.userId, recentPerformance);

        const adaptationResult = await NeuralPredictionService
          .adaptToPerformance(cognitiveAnalysis);

        dispatch({
          type: 'NEURAL_ADAPTATION',
          payload: {
            timestamp: Date.now(),
            analysis: cognitiveAnalysis,
            adaptation: adaptationResult,
            newConfidence: adaptationResult.confidence
          }
        });
      } catch (error) {
        console.error('Neural adaptation failed:', error);
      }
    }

    adaptNeuralSystem();
  }, [state.gameHistory]);

  // Game functions
  const startNewRound = async () => {
    try {
      const userState = {
        profile: state.learningProfile,
        history: state.gameHistory,
        cognitiveState: state.cognitiveState,
        neuralState: state.neuralState
      };

      const difficulty = await AdaptiveDifficultyEngine
        .calculateOptimalDifficulty(userState, state.gameHistory);

      const predictions = await NeuralPredictionService
        .predictNextWords(userState, difficulty);

      const nextWord = predictions[0]; // Best prediction

      dispatch({
        type: 'START_ROUND',
        payload: {
          word: nextWord.word,
          difficulty: difficulty.level,
          predictions: predictions,
          confidence: nextWord.confidence
        }
      });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: { error: 'Failed to start new round' }
      });
    }
  };

  const submitGuess = async (guess) => {
    const endTime = Date.now();
    const timeSpent = endTime - state.startTime;
    const success = guess.toLowerCase() === state.currentWord.toLowerCase();

    const roundData = {
      word: state.currentWord,
      guess,
      success,
      timeSpent,
      difficulty: state.difficulty,
      hints: state.hints
    };

    const points = calculatePoints(roundData);
    const accuracy = calculateAccuracy(guess, state.currentWord);
    const speed = calculateSpeedScore(timeSpent, state.currentWord.length);

    // Update psychological state
    const psychState = await PsychologicalAdaptationService
      .analyzeUserState(state.userId, { ...roundData, points, accuracy, speed });

    dispatch({
      type: 'SUBMIT_GUESS',
      payload: {
        roundData,
        points,
        success,
        accuracy,
        speed
      }
    });

    dispatch({
      type: 'UPDATE_COGNITIVE_STATE',
      payload: {
        cognitiveState: psychState.cognitiveState,
        motivationState: psychState.motivationFactors,
        adaptiveSettings: psychState.adaptiveStrategy,
        learningRate: calculateLearningRate(state.gameHistory)
      }
    });

    return { success, points, psychState };
  };

  // Helper functions
  const calculatePoints = (roundData) => {
    const basePoints = roundData.success ? 100 : 0;
    const timeBonus = Math.max(0, 50 - Math.floor(roundData.timeSpent / 1000));
    const difficultyBonus = Math.floor(roundData.difficulty * 100);
    const hintPenalty = roundData.hints.length * 25;

    return basePoints + timeBonus + difficultyBonus - hintPenalty;
  };

  const calculateAccuracy = (guess, word) => {
    let correct = 0;
    for (let i = 0; i < Math.min(guess.length, word.length); i++) {
      if (guess[i].toLowerCase() === word[i].toLowerCase()) correct++;
    }
    return correct / word.length;
  };

  const calculateSpeedScore = (time, wordLength) => {
    const optimalTime = wordLength * 1000; // 1 second per letter
    return Math.max(0, 1 - (time / (optimalTime * 2)));
  };

  const calculateLearningRate = (history) => {
    if (history.length < 5) return 0;
    const recentGames = history.slice(-5);
    const successRate = recentGames.filter(g => g.success).length / 5;
    const averageTime = recentGames.reduce((sum, g) => sum + g.timeSpent, 0) / 5;
    return (successRate * 0.7 + (1 - averageTime / 30000) * 0.3);
  };

  return (
    <GameContext.Provider
      value={{
        ...state,
        startNewRound,
        submitGuess
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
