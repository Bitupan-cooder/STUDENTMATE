import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function AnimatedText({ text, className = '', style }: AnimatedTextProps) {
  const containerRef = useRef<HTMLParagraphElement | null>(null);
  
  // Track scroll position of the paragraph element with offset ['start 0.8', 'end 0.2']
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const chars = text.split('');

  return (
    <p ref={containerRef} className={`${className} relative flex flex-wrap justify-center`} style={style}>
      {chars.map((char, index) => {
        // Calculate the relative timing bounds for each character
        const start = index / chars.length;
        const end = Math.min(1, (index + 3) / chars.length); // small overlap for smooth transition

        return (
          <Character
            key={index}
            char={char}
            progress={scrollYProgress}
            range={[start, end]}
          />
        );
      })}
    </p>
  );
}

interface CharacterProps {
  key?: React.Key;
  char: string;
  progress: any;
  range: [number, number];
}

function Character({ char, progress, range }: CharacterProps) {
  // Animates from opacity 0.2 to 1 based on scroll position in range
  const opacity = useTransform(progress, range, [0.2, 1]);

  return (
    <span className="relative inline-block select-none" style={{ marginRight: char === ' ' ? '0.3em' : '0.02em' }}>
      {/* Invisible placeholder to reserve layout dimensions */}
      <span className="opacity-0">{char}</span>
      {/* Absolute positioned animated character */}
      <motion.span
        style={{ opacity }}
        className="absolute inset-0"
      >
        {char}
      </motion.span>
    </span>
  );
}
