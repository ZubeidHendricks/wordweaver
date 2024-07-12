
import React from 'react';
import { useSpring, animated } from 'react-spring';

const LetterWheel = ({ letters, onLetterSelect }) => {
  const wheelRadius = 150;
  const letterCount = letters.length;

  return (
    <svg width={wheelRadius * 2} height={wheelRadius * 2}>
      {letters.map((letter, index) => {
        const angle = (index / letterCount) * 2 * Math.PI - Math.PI / 2;
        const x = wheelRadius + wheelRadius * 0.7 * Math.cos(angle);
        const y = wheelRadius + wheelRadius * 0.7 * Math.sin(angle);

        const spring = useSpring({
          from: { opacity: 0, transform: 'scale(0)' },
          to: { opacity: 1, transform: 'scale(1)' },
          delay: index * 100,
        });

        return (
          <animated.text
            key={index}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="24"
            onClick={() => onLetterSelect(letter, index)}
            style={{ cursor: 'pointer', ...spring }}
          >
            {letter}
          </animated.text>
        );
      })}
    </svg>
  );
};

export default LetterWheel;