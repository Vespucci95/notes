import * as React from 'react';
import { motion, MotionProps, MotionValue, useSpring, useTransform } from 'framer-motion';

type AnimatedProps = { value: MotionValue<number> } & Omit<MotionProps, 'children'>

const AnimatedNumber = ({ value, ...props }: AnimatedProps) => {
  const roundedPercentage = useTransform(value, Math.round);
  return (
    <motion.div {...props}>{roundedPercentage}</motion.div>
  )
}

export default AnimatedNumber;