import * as React from "react"
import { graphql, useStaticQuery } from 'gatsby';
import { AllSnbDataQuery } from '@/__generated__/gatsby-types'
import { isType } from '@/types/guards';

const UNTITLED = 'untitled'
const NO_NAME = 'noname'
const FILE_NAME = 'File'

const useSNB = () => {
  const data: AllSnbDataQuery = useStaticQuery(graphql`
      query AllSnbData {
          allMarkdownRemark {
              nodes {
                  frontmatter {
                      title
                  }
                  parent {
                      __typename
                      ... on File {
                          relativePath
                          name
                      }
                  }
              }
          }
      }
  `)

  return data.allMarkdownRemark.nodes.map((node, index) => ({
    title: node.frontmatter?.title ?? UNTITLED,
    path: isType(node.parent, FILE_NAME) ? node.parent.relativePath : '/',
    fileName: isType(node.parent, FILE_NAME) ? node.parent.name : NO_NAME + index,
  }))
}

const SNB = () => {

  const snbData = useSNB();

  return (
    <aside>
    </aside>
  )
}

export default SNB;