import React from 'react';

const WordGrid = ({ words, completedWords }) => {
  return (
    <div className="word-grid">
      {words.map((word, index) => (
        <div key={index} className={`word ${completedWords.includes(word) ? 'completed' : ''}`}>
          {word.split('').map((letter, letterIndex) => (
            <span key={letterIndex} className="letter">
              {completedWords.includes(word) ? letter : '_'}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default WordGrid;