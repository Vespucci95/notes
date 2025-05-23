import * as React from 'react';
import { motion } from 'framer-motion';
import styles from './post-header.module.scss'
import { useFetchAppConfig } from '@/queries/app-config';

type PostHeaderProps = {
  title: string;
  date: string;
  description: string;
  category: string;
}

const PostHeader = ({ title, category, date }: PostHeaderProps) => {
  const { site } = useFetchAppConfig()

  return (
    <motion.div
      className={styles['postHeader__container']}
    >
      <h1 className={styles['postHeader__title']}>
        {title || site.siteMetadata.defaultPostTitle}
      </h1>
      <div className={styles['postHeader__meta']}>
        <p>{category || site.siteMetadata.defaultCategoryName}</p>
        <p>{date}</p>
      </div>
    </motion.div>
  )
}

export default PostHeader;