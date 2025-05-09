import * as React from 'react';
import { HTMLAttributes, PropsWithChildren } from 'react';
import { motion, MotionProps } from 'framer-motion';
import styles from './post-container.module.scss';

const PostContainer = ({ children, className, ...props }: PropsWithChildren<MotionProps & HTMLAttributes<HTMLDivElement>>) => {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`${styles['animatedContainer__content']} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default PostContainer;