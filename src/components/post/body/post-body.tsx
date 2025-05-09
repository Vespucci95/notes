import * as React from 'react';
import styles from './post-body.module.scss';

interface MDXProps {
  html: string;
}

const PostBody: React.FC<MDXProps> = ({ html }) => {
  return (
    <div className={styles['mdx']}>
      <div className={styles['mdx__content']} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

export default PostBody;