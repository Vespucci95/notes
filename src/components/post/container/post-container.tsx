import * as React from 'react';
import { Animated } from '@/components/animated';
import { FadeInUpProps } from '@/components/animated/fade-in-up';
import styles from './post-container.module.scss'

const PostContainer = ({ children, className, ...props }: FadeInUpProps) => {
  return (
    <Animated.FadeInUp className={`${styles.container} ${className}`} {...props} >
      {children}
    </Animated.FadeInUp>
  );
};

export default PostContainer;