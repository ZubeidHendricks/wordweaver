import React, { useState, useEffect } from 'react';
import GameMascot from './GameMascot';
import GameStage from './GameStage';

const Game = () => {
  const [currentStage, setCurrentStage] = useState('intro');
  const [mascotState, setMascotState] = useState({
    mood: 'normal',
    message: 'Ready to play!'
  });
  const [gameState, setGameState] = useState({
    isActive: false,
    currentWord: '',
    score: 0,
    timeLeft: 60,
    hintsLeft: 3
  });

  const handleStageComplete = () => {
    const stages = ['intro', 'tutorial', 'warmup', 'main', 'challenge', 'boss', 'victory'];
    const currentIndex = stages.indexOf(currentStage);
    if (currentIndex < stages.length - 1) {
      setCurrentStage(stages[currentIndex + 1]);
      updateMascotForStage(stages[currentIndex + 1]);
    }
  };

  const updateMascotForStage = (stage) => {
    const stageConfigs = {
      intro: { mood: 'excited', message: "Hi! I'm your word learning buddy!" },
      tutorial: { mood: 'thinking', message: 'Let me show you how to play!' },
      warmup: { mood: 'happy', message: "Let's start with something easy!" },
      main: { mood: 'normal', message: 'You can do it!' },
      challenge: { mood: 'surprised', message: 'Things are getting tricky!' },
      boss: { mood: 'worried', message: 'These are some tough words!' },
      victory: { mood: 'celebrating', message: 'You did it! Amazing!' }
    };

    setMascotState(stageConfigs[stage] || stageConfigs.main);
  };

  // Your existing game logic here...

  return (
    <div className="game-container">
      {/* Show stage transition if not in main game */}
      {currentStage !== 'main' && (
        <GameStage 
          stage={currentStage} 
          onStageComplete={handleStageComplete} 
        />
      )}

      {/* Main game content */}
      <div className="game-content">
        {/* Your existing game UI */}
      </div>

      {/* Mascot */}
      <GameMascot 
        mood={mascotState.mood}
        message={mascotState.message}
      />

      <style jsx>{`
        .game-container {
          position: relative;
          min-height: 100vh;
          padding: 20px;
        }

        .game-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default Game;
