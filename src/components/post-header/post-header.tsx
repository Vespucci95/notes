import * as React from 'react';
import { motion } from 'framer-motion';
import styles from './post-header.module.scss'

type PostHeaderProps = {
  title: string;
  date: string;
  category: string;
}

const PostHeader = ({ title, category, date }: PostHeaderProps) => {
  return (
    <motion.div
      className={styles.headerContainer}
    >
      <h1>{title}</h1>
      <div>
        <p>{category}</p>
        <p>{date}</p>
      </div>
    </motion.div>
  )
}

export default PostHeader;