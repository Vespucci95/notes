import * as React from "react"
import { graphql } from 'gatsby';
import { PostQuery } from '@/__generated__/gatsby-types'
import { DeepRequired } from '@/types';

const PostTemplate = ({ data }: { data: DeepRequired<PostQuery> }) => {
  return (
    <div className="markdown">
      <div>
        <h1 className="title">{data.markdownRemark.frontmatter.title}</h1>
        <div>
          <p>{data.markdownRemark.frontmatter.description}</p>
          <p>{data.markdownRemark.frontmatter.date}</p>
        </div>
      </div>
      <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
    </div>
  )
}

export const query = graphql`
    query Post($path:String) {
        markdownRemark(fields:{ path:{ eq: $path } }) {
            id
            html
            frontmatter {
                title
                date(formatString: "YYYY.MM.DD")
                categories
                description
            }
        }
    }
`

export default PostTemplate