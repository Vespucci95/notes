import * as React from 'react';
import { motion, MotionProps, MotionValue, useSpring, useTransform } from 'framer-motion';

const AnimatedNumber = ({ value, ...props }: {
  value: MotionValue<number>
} & Omit<MotionProps, 'children'>) => {
  const animatedPercentage = useSpring(value, {
    stiffness: 100,
    damping: 30,
    mass: 0.8,
    velocity: 0.7
  })
  const roundedPercentage = useTransform(animatedPercentage, Math.round);

  return (
    <motion.div {...props}>{roundedPercentage}</motion.div>
  )
}

export default AnimatedNumber;