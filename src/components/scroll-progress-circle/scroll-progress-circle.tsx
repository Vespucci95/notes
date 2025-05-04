import * as React from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Animated } from '@/components/animated';

const ScrollProgressCircle = () => {
  const { scrollYProgress } = useScroll();
  const percentage = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.8,
    velocity: 0.7
  });

  const size = 20;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <motion.div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '6px',
        width: '100%'
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#71717B"
          fill='none'
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#FFF"
          fill='none'
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={useTransform(scaleX, v => circumference * (1 - v))}
          style={{ strokeLinecap: 'round' }}
        >
        </motion.circle>
      </svg>
      <div
        style={{ fontWeight: 'bold', color: '#FFF' }}
      >
        <div style={{ display: 'flex', fontSize: '0.8rem', width: '36px' }}>
          <Animated.Number value={percentage} />%
        </div>
      </div>
    </motion.div>
  )
}

export default ScrollProgressCircle