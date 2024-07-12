const Game = require('../models/GameModel');
const Challenge = require('../models/ChallengeModel');
const axios = require('axios');

const DICTIONARY_API_BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

// Cache for valid words
const wordCache = new Map();

// Cache expiration time (in milliseconds)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours

exports.getGame = async (req, res) => {
  try {
    const { difficulty } = req.query;
    let game = await Game.findOne({ difficulty, isDaily: false });
    
    if (!game) {
      game = await generateGame(difficulty);
    }
    
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching game', error });
  }
};

const generateGame = async (difficulty) => {
  const wordCounts = {
    easy: 8,
    medium: 12,
    hard: 16
  };
  
  const count = wordCounts[difficulty];
  const letters = generateLetters();
  const words = await generateWords(letters, count, difficulty);
  
  return new Game({ difficulty, words, letters, isDaily: false });
};

exports.getDailyChallenge = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let challenge = await Game.findOne({ date: today, isDaily: true });
    
    if (!challenge) {
      challenge = await generateDailyChallenge();
    }
    
    res.json(challenge);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching daily challenge', error });
  }
};

const generateDailyChallenge = async () => {
  const letters = generateLetters();
  const words = await generateWords(letters, 20, 'hard');
  
  return new Game({ 
    isDaily: true, 
    date: new Date().toISOString().split('T')[0],
    words,
    letters,
    difficulty: 'hard'
  });
};

const generateLetters = () => {
  const letters = [];
  const vowels = 'AEIOU';
  const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';

  // Ensure at least 2 vowels
  for (let i = 0; i < 2; i++) {
    letters.push(vowels[Math.floor(Math.random() * vowels.length)]);
  }

  // Fill the rest with a mix of consonants and vowels
  while (letters.length < 9) {
    const letterSet = Math.random() > 0.7 ? vowels : consonants;
    const letter = letterSet[Math.floor(Math.random() * letterSet.length)];
    if (!letters.includes(letter)) {
      letters.push(letter);
    }
  }

  return letters;
};

const generateWords = async (letters, count, difficulty) => {
  const words = new Set();
  const minLength = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;

  while (words.size < count) {
    const wordLength = minLength + Math.floor(Math.random() * 4); // Up to minLength + 3
    let word = '';
    for (let i = 0; i < wordLength; i++) {
      word += letters[Math.floor(Math.random() * letters.length)];
    }
    if (await isValidWord(word)) {
      words.add(word);
    }
  }

  return Array.from(words);
};

const isValidWord = async (word) => {
  // Check cache first
  if (wordCache.has(word)) {
    const cacheEntry = wordCache.get(word);
    if (Date.now() - cacheEntry.timestamp < CACHE_EXPIRATION) {
      return cacheEntry.isValid;
    } else {
      // Cache entry expired, remove it
      wordCache.delete(word);
    }
  }

  try {
    const response = await axios.get(`${DICTIONARY_API_BASE_URL}${word}`);
    const isValid = response.status === 200;
    
    // Cache the result
    wordCache.set(word, { isValid, timestamp: Date.now() });
    
    return isValid;
  } catch (error) {
    // Cache the negative result too
    wordCache.set(word, { isValid: false, timestamp: Date.now() });
    return false;
  }
};

// Function to clear expired cache entries (call this periodically)
const clearExpiredCache = () => {
  const now = Date.now();
  for (const [word, entry] of wordCache.entries()) {
    if (now - entry.timestamp > CACHE_EXPIRATION) {
      wordCache.delete(word);
    }
  }
};

// Clear expired cache entries every hour
setInterval(clearExpiredCache, 60 * 60 * 1000);