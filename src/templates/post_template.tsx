import * as React from "react"
import { graphql } from 'gatsby';
import { PostQuery } from '@/__generated__/gatsby-types'
import { DeepRequired } from '@/types';

import ScrollProgress from '@/components/scroll-progress/scroll-progress';
import { Post } from '@/components/post';
import styles from './post_template.module.scss';

const PostTemplate = ({ data }: { data: DeepRequired<PostQuery> }) => {
  return (
    <div className={styles['postTemplate']}>
      <div className={styles['postTemplate__sideLeft']}>
      </div>
      <Post className={styles['postTemplate__content']}>
        <Post.Header
          title={data.markdownRemark.frontmatter.title}
          category={data.markdownRemark.fields.category}
          date={data.markdownRemark.frontmatter.date}
        />
        <Post.Body html={data.markdownRemark.html} />
      </Post>
      <div className={styles['postTemplate__sideRight']}>
        <ScrollProgress toc={data.markdownRemark.enhancedHeadings} />
      </div>
    </div>
  )
}

export const query = graphql`
    query Post($path: String) {
        markdownRemark(fields: {path: {eq: $path}}) {
            id
            html
            frontmatter {
                title
                date(formatString: "YYYY.MM.DD")
                categories
                description
            }
            fields {
                category
            }
            enhancedHeadings {
                id
                value
                depth
                contentLength
            }
        }
    }
`

export default PostTemplate