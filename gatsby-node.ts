import { CreateNodeArgs, GatsbyNode } from 'gatsby';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { createFilePath } from 'gatsby-source-filesystem';
const createPostPathField = ({ node, getNode, actions, store }: CreateNodeArgs) => {
  const { createNodeField } = actions;
  const siteMetadata = store.getState().config.siteMetadata;

  if (node.internal.type === `MarkdownRemark`) {
    const path = createFilePath({ node, getNode, basePath: siteMetadata.obsidianNoteName });
    createNodeField({ node, name: 'path', value: path });
  }
}

const createCategoryField = ({ node, getNode, actions, store, reporter }: CreateNodeArgs) => {
  const { createNodeField } = actions;
  const siteMetadata = store.getState().config.siteMetadata;

  if (node.internal.type === `MarkdownRemark`) {
    if (!node?.parent) {
      reporter.error(`[onCreateNode] MarkdownRemark 노드 ${node.id}에 부모가 없습니다.`);
      return
    }

    const parentNode = getNode(node.parent);

    if (!parentNode) {
      reporter.warn(`[onCreateNode] ${node.id} 의 부모노드를 찾을 수 없습니다.`)
      return
    }

    const categoryName = (parentNode.relativePath as string).split('/').at(0) ?? siteMetadata.defaultCategoryName;
    const category: string = /\.[md|mdx]+/g.test(categoryName) ? siteMetadata.defaultCategoryName : categoryName;

    createNodeField({ node, name: siteMetadata.categoryFieldName, value: category });
  }
}

type CreatePageQuery = {
  allMarkdownRemark: {
    edges: Array<{
      node: {
        fields: {
          path: string
        }
      }
    }>
  }
}

export const createPages: GatsbyNode['createPages'] = async ({ actions, graphql, reporter }) => {
  const {createPage} = actions;
  const result = await graphql<CreatePageQuery>(`
      query CreatePage {
          allMarkdownRemark {
              edges {
                  node {
                      fields {
                          path
                      }
                  }
              }
          }
      }
  `)

  if(!result.data || result.errors) {
    reporter.panicOnBuild(`[createPages] 데이터를 불러오지 못하였습니다.`)
    return;
  }

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.path,
      component: `${__dirname}/src/templates/post_template.tsx`,
      context: {},
    })
  })
}

export const onCreateNode: GatsbyNode['onCreateNode'] = (a) => [
  createPostPathField,
  createCategoryField
].forEach(f => f(a))

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({ getConfig, actions }) => {
  const output = (getConfig().output as object) || {};

  actions.setWebpackConfig({
    output,
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
    },
  });
};