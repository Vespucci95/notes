import React from 'react';
import { graphql, Link, PageProps } from 'gatsby';
import { TagPageQuery } from '@/__generated__/gatsby-types';
import styles from './tag_template.module.scss';
import { DeepRequired } from '@/types';

type TagPageContext = {
  tagName: string;
  slug: string;
}

const TagTemplate: React.FC<PageProps<DeepRequired<TagPageQuery>, TagPageContext>> = ({ data }, context) => {
  return (
    <div className={styles['tagTemplate']}>
      {
        data.allMarkdownRemark.edges.map((edge) => (
          <Link to={edge.node.fields.path} key={edge.node.id} >
            <h1>{edge.node.frontmatter.title}</h1>
            <p>{edge.node.frontmatter.date}</p>
          </Link>
        ))
      }
    </div>
  );
};

export default TagTemplate;

export const query = graphql`
    query TagPage($tagName: String) {
        allMarkdownRemark(
            sort: {frontmatter: {date: DESC}}
            filter: {tags: {eq: $tagName}}
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
                        date(formatString: "YYYY년 MM월 DD일")
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