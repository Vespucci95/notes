import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  pathPrefix: '/notes',
  siteMetadata: {
    /**
     * 데이터 추가 시
     * src/queries/app-config.ts
     */
    title: `hyunseo`,
    author: '이현서',
    description: '메모장',
    siteUrl: `https://vespucci95.github.io/notes`,
    obsidianNoteName: 'notes',
    categoryFieldName: 'category',
    postTemplateBasePath: 'post',
    defaultCategoryName: '기본',
    defaultPostTitle: '제목 없음'
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    {
      resolve: "gatsby-plugin-sass",
      options: {
        cssLoaderOptions: {
          esModule: true,
          modules: {
            namedExport: false
          },
        },
      },
    },
    "gatsby-plugin-image",
    "gatsby-plugin-sitemap",
    {
      resolve: 'gatsby-plugin-typescript',
      options: {
        isTSX: true,
        jsxPragma: 'jsx',
        allExtensions: true,
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/images/icon_moon.png',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        "name": "images",
        "path": "src/images/"
      },
      __key: "images"
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        "name": "pages",
        "path": "src/pages/"
      },
      __key: "pages"
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'notes',
        path: `${__dirname}/notes`,
        ignore: [`**/.*`],
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-obsidian-syntax`,
            options: {
              toHashTagUrl: (value: number) => `/tags/${value}`,
              toPageUrl: (value: number) => `/post/${value}`,
              toImageUrl: (value: number) => `/AttachedFiles/${value}`
            }
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 768,
              quality: 100,
              withWebp: true,
              linkImagesToOriginal: false,
            },
          },
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              classPrefix: 'language-',
            },
          },
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              className: `post-toc`,
              maintainCase: false,
              removeAccents: true,
              elements: [`h1`, `h2`, `h3`]
            },
          },
        ]
      }
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, '.mdx'],
      },
    }
  ]
};

export default config;
