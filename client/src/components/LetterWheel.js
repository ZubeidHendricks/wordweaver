import React from 'react';

const LetterWheel = ({ letters, onLetterSelect }) => {
  const wheelRadius = 150;
  const letterCount = letters.length;

  return (
    <svg width={wheelRadius * 2} height={wheelRadius * 2}>
      {letters.map((letter, index) => {
        const angle = (index / letterCount) * 2 * Math.PI - Math.PI / 2;
        const x = wheelRadius + wheelRadius * 0.7 * Math.cos(angle);
        const y = wheelRadius + wheelRadius * 0.7 * Math.sin(angle);

        return (
          <text
            key={index}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="24"
            onClick={() => onLetterSelect(letter, index)}
            style={{ cursor: 'pointer' }}
          >
            {letter}
          </text>
        );
      })}
    </svg>
  );
};

export default LetterWheel;