import * as React from "react"
import { graphql, HeadFC, PageProps } from "gatsby"
import SNB from '@/components/snb';


const IndexPage: React.FC<PageProps> = ({ data }) => {
  return (
    <main>
      <SNB />
    </main>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>note</title>