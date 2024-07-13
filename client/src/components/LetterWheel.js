import React from 'react';
import { useTrail, animated } from 'react-spring';

// Custom hook for the spring animations using useTrail
const useLetterSprings = (letters) => {
  return useTrail(letters.length, {
    from: { opacity: 0, transform: 'scale(0)' },
    to: { opacity: 1, transform: 'scale(1)' },
    delay: 200,
    config: { mass: 1, tension: 120, friction: 14 },
  });
};

const LetterWheel = ({ letters, onLetterSelect }) => {
  const wheelRadius = 150;
  const letterCount = letters.length;

  // Use the custom hook to get the springs for each letter
  const springs = useLetterSprings(letters);

  return (
    <svg width={wheelRadius * 2} height={wheelRadius * 2}>
      {springs.map((spring, index) => {
        const angle = (index / letterCount) * 2 * Math.PI - Math.PI / 2;
        const x = wheelRadius + wheelRadius * 0.7 * Math.cos(angle);
        const y = wheelRadius + wheelRadius * 0.7 * Math.sin(angle);

        return (
          <animated.text
            key={index}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="24"
            onClick={() => onLetterSelect(letters[index], index)}
            style={{ cursor: 'pointer', ...spring }}
          >
            {letters[index]}
          </animated.text>
        );
      })}
    </svg>
  );
};

export default LetterWheel;
