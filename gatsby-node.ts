import { CreateNodeArgs, GatsbyNode } from 'gatsby';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { createFilePath } from 'gatsby-source-filesystem';
import { MarkdownRemark } from '@/__generated__/gatsby-types';

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
  const { createPage } = actions;
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

  if (!result.data || result.errors) {
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

type HeadingInfo = {
  id: string;
  value: string;
  depth: number;
  contentLength: number;
}

type RawHeading = {
  value: string;
  depth: number;
  lineIndex: number;
};

type HeadingSection = {
  heading: RawHeading;
  content: string[];
};

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = ({ actions }) => {
  const { createTypes } = actions;

  createTypes(`
    type HeadingInfo {
      id: String!
      value: String!
      depth: Int!
      contentLength: Int!
    }
  `);
};

export const createResolvers: GatsbyNode['createResolvers'] = ({ createResolvers }) => {
  const parseHeading = (line: string, lineIndex: number): RawHeading | null => {
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (!match) return null;

    return {
      value: match[2],
      depth: match[1].length,
      lineIndex
    };
  };

  const splitIntoSections = (lines: string[]): HeadingSection[] => {
    const headings = lines
      .map(parseHeading)
      .filter((heading): heading is RawHeading => heading !== null);

    return headings.map((heading, idx) => {
      const nextHeadingIndex = idx < headings.length - 1
        ? headings[idx + 1].lineIndex
        : lines.length;

      return {
        heading,
        content: lines.slice(heading.lineIndex + 1, nextHeadingIndex)
      };
    });
  };

  const createHeadingInfo = ({ heading, content }: HeadingSection): HeadingInfo => ({
    id: heading.value
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, '-')
      .replace(/(^-|-$)/g, ''),
    value: heading.value,
    depth: heading.depth,
    contentLength: content
      .join('\n')
      .replace(/[#*`_~\[\]()]/g, '')
      .replace(/\s+/g, '')
      .length
  });

  createResolvers({
    MarkdownRemark: {
      enhancedHeadings: {
        type: '[HeadingInfo]',
        resolve: ({ rawMarkdownBody }: MarkdownRemark): HeadingInfo[] => {
          if (!rawMarkdownBody) return [];

          const lines = rawMarkdownBody.split('\n').filter(Boolean);

          return splitIntoSections(lines).map(createHeadingInfo);
        }
      }
    }
  });
};

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