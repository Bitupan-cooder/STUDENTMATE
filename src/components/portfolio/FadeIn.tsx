import React from 'react';
import { motion } from 'motion/react';

interface FadeInProps {
  key?: React.Key;
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: keyof typeof motion;
  className?: string;
  onClick?: () => void;
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  as = 'div',
  className = '',
  onClick,
}: FadeInProps) {
  // Use dynamically created motion component
  const MotionComponent = (motion as any)[as] || motion.div;

  return (
    <MotionComponent
      className={className}
      onClick={onClick}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{
        delay,
        duration,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </MotionComponent>
  );
}
