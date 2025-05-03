import * as React from "react"
import { graphql } from 'gatsby';
import { PostQuery } from '@/__generated__/gatsby-types'
import { DeepRequired } from '@/types';
import PostHeader from '@/components/post-header/post-header';
import { motion } from 'framer-motion';

const MDX = ({ html }: { html: string }) => {
  return (
    <div className="markdown">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

const PostTemplate = ({ data }: { data: DeepRequired<PostQuery> }) => {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.3,
        ease: "easeOut"
      }}
      style={{ width: '100%' }}
    >
      <PostHeader
        title={data.markdownRemark.frontmatter.title}
        category={data.markdownRemark.fields.category}
        date={data.markdownRemark.frontmatter.date}
      />
      <MDX html={data.markdownRemark.html} />
    </motion.div>
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
        }
    }
`

export default PostTemplate