import { useFetchAllCategoriesQuery } from '@/queries/categories';
import { useFetchAppConfig } from '@/queries/app-config';
import { useMemo } from 'react';

export type Post = {
  title: string;
  path: string;
  description: string;
  tags: string[];
}

export type CategoryModel = {
  categoryName: string;
  posts: Post[]
}

export const useCategoryListViewModel = (): CategoryModel[] => {
  const categories = useFetchAllCategoriesQuery();
  const { site } = useFetchAppConfig();

  return useMemo(() => categories.allMarkdownRemark.group.map((category) => (
      {
        categoryName: category.fieldValue || site.siteMetadata.categoryFieldName,
        posts: category.edges.map((edge) => ({
          title: edge.node.frontmatter?.title || site.siteMetadata.defaultPostTitle,
          path: edge.node.fields?.path || '/',
          description: edge.node.frontmatter?.description || '',
          tags: edge.node.tags as string[]
        })),
      }
    )),
    [categories, site]
  );
}