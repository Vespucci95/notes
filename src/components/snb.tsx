import * as React from "react"
import { graphql, Link, useStaticQuery } from 'gatsby';
import { AllSnbDataQuery } from '@/__generated__/gatsby-types'
import { isType } from '@/types/guards';
import { Accordion } from 'radix-ui';
import { entries, groupBy, head, map, pipe, split, toArray } from '@fxts/core';

const UNTITLED = '제목 없음'
const NO_NAME = 'noname'
const FILE_NAME = 'File'
const DEFAULT_CATEGORY_NAME = '기본'

const useSNBQuery = (): AllSnbDataQuery => useStaticQuery(graphql`
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


type SnbNode = {
  title: string
  path: string
  fileName: string
}

type CategoryItem = {
  title: string;
  path: string;
}

type Category = {
  categoryName: string;
  items: CategoryItem[];
}

const convertToSnbNodes = (data: AllSnbDataQuery): SnbNode[] => {
  return data.allMarkdownRemark.nodes.map((node, index) => ({
    title: node.frontmatter?.title ? node.frontmatter?.title : UNTITLED,
    path: isType(node.parent, FILE_NAME) ? node.parent.relativePath : '/',
    fileName: isType(node.parent, FILE_NAME) ? node.parent.name : NO_NAME + index,
  }))
}

const isMarkDown = (fileName: string): boolean => /\.[md|mdx]+/g.test(fileName)

const convertToCategory = (data: SnbNode[]): Category[] => {
  return pipe(
    data,
    map(node => {
      const categoryName = pipe(node.path, split('/'), head) ?? DEFAULT_CATEGORY_NAME;
      return {
        categoryName: isMarkDown(categoryName) ? DEFAULT_CATEGORY_NAME : categoryName,
        ...node
      }
    }),
    groupBy(a => a.categoryName),
    entries,
    map(([categoryName, nodes]) => ({
      categoryName,
      items: pipe(
        nodes,
        map(node => ({
          title: node.title,
          path: node.path
        })),
        toArray
      )
    })),
    toArray
  )
}

const useSNB = () => {
  const data = useSNBQuery();
  return pipe(
    convertToSnbNodes(data),
    convertToCategory,
    toArray
  )
}

const SNB = () => {

  const snbData = useSNB();

  return (
    <aside>
      <Accordion.Root
        type='multiple'
      >
        {
          snbData.map((category) => (
            <Accordion.Item value={category.categoryName}>
              <Accordion.Trigger>{category.categoryName}</Accordion.Trigger>
              <Accordion.Content>
                {
                  category.items.map((item) => (
                    <Link style={{ display: 'block' }} to={item.path}>{item.title}</Link>
                  ))
                }
              </Accordion.Content>
            </Accordion.Item>
          ))
        }
      </Accordion.Root>
    </aside>
  )
}

export default SNB;