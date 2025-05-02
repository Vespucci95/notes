import * as React from "react"
import { HeadFC, PageProps } from "gatsby"


const IndexPage: React.FC<PageProps> = ({ data }) => {
  return (
    <div>
      main
    </div>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>note</title>