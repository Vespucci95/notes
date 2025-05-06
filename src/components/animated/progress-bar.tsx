import { motion, MotionValue, useTransform } from 'framer-motion';
import * as React from 'react';

type ProgressBarProps = {
  width?: number;
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  percentage: MotionValue<number>;
}

const ProgressBar = (
  {
    width = 50,
    height = 4,
    backgroundColor = '#71717B',
    progressColor = '#FFF',
    percentage
  }: ProgressBarProps) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: height / 2,
        backgroundColor,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <motion.div
        style={{
          width: useTransform(percentage, v => `${v}%`),
          height: '100%',
          backgroundColor: progressColor,
          transformOrigin: 'left',
        }}
      />
    </div>
  )
}

export default ProgressBar;