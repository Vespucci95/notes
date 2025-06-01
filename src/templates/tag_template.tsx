import React from 'react';
import { graphql, PageProps } from 'gatsby';
import { TagPageQuery } from '@/__generated__/gatsby-types';

type TagPageContext = {
  tagName: string;
  slug: string;
}

const TagTemplate: React.FC<PageProps<TagPageQuery, TagPageContext>> = () => {
  return (
    <div className="tag-page">
      준비중
    </div>
  );
};

export default TagTemplate;

export const query = graphql`
    query TagPage {
        allMarkdownRemark(
            sort: { frontmatter: { date: DESC } }
        ) {
            edges {
                node {
                    id
                    fields {
                        path
                        category
                    }
                    frontmatter {
                        title
                        date(formatString: "YYYY.MM.DD")
                    }
                    excerpt(pruneLength: 200)
                    parent {
                        ... on File {
                            name
                        }
                    }
                    tags
                }
            }
        }
    }
`;