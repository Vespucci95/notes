import React from 'react';
import { graphql, PageProps } from 'gatsby';
import { TagPageQuery } from '@/__generated__/gatsby-types';
import styles from './tag_template.module.scss';
import { DeepRequired } from '@/types';
import Category from '@/components/category/category';
import { CategoryModel } from '@/hooks/use-category-list-view-model';

type TagPageContext = {
  tagName: string;
  slug: string;
}

const TagTemplate: React.FC<PageProps<DeepRequired<TagPageQuery>, TagPageContext>> = ({ data }, context) => {
  const categoryData:CategoryModel[] = data.allMarkdownRemark.group.map(({ fieldValue, edges }) => ({
    categoryName: fieldValue,
    posts: edges.map(({ node }) => ({
      title: node.frontmatter.title,
      path: node.fields.path
    }))
  }));
  return (
    <div className={styles['tagTemplate']}>
      <Category data={categoryData} />
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
            group(field: {fields: {category: SELECT}}) {
                fieldValue
                totalCount
                edges {
                    node {
                        id
                        frontmatter {
                            title
                            date
                        }
                        fields {
                            path
                        }
                    }
                }
            }
        }
    }
`;