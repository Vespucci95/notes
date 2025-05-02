import * as React from "react"
import { graphql } from 'gatsby';

const PostTemplate = ({ data }: any) => {
  return (
    <div className="markdown">
      <div className="markdown-render" dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
    </div>
  )
}

export const query = graphql`
    query Post($path:String) {
        markdownRemark(fields:{ path:{ eq: $path } }) {
            id
            html
        }
    }
`

export default PostTemplate