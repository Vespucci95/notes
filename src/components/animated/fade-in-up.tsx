import * as React from 'react';
import { motion, MotionProps } from 'framer-motion';

export type FadeInUpProps = MotionProps & { className?: string; }

const FadeInUp = ({ children, ...props }: FadeInUpProps) => {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default FadeInUp;