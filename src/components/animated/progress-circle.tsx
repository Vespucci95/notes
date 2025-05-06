import { motion, MotionProps, MotionValue, useTransform } from 'framer-motion';
import * as React from 'react';

type AnimatedProgressCircleProps = {
  value: MotionValue<number> // 0 ~ 100
} & Omit<MotionProps, 'children'>

const AnimatedProgressCircle = ({ value }: AnimatedProgressCircleProps) => {
  const size = 20;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
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
        strokeDashoffset={useTransform(value, v => circumference * (100 - v) * 0.01)}
        style={{ strokeLinecap: 'round' }}
      >
      </motion.circle>
    </svg>
  )
}

export default AnimatedProgressCircle